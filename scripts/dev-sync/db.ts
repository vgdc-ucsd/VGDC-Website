import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import * as readline from 'readline';
import { compose } from './docker';
import { hostOf } from './guards';

// Must match the db service in docker-compose.yml
const DB_USER = 'postgres';
const DB_NAME = 'vgdc';
/** Inside the container, so the dump never goes through a pipe on the host */
const DUMP_PATH = '/tmp/remote.dump';
const ANONYMIZE_SQL = path.join(process.cwd(), 'scripts', 'dev-sync', 'anonymize.sql');

/**
 * Replaces the local database with a copy of the remote public schema, then
 * applies any migrations newer than prod and scrubs personal data.
 *
 * @returns false if the user cancelled
 */
export async function pullDatabase({ yes }: { yes: boolean }): Promise<boolean> {
  const localTables = Number(psql(
    `SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name <> '_prisma_migrations'`,
    'Checking the local database',
  ).trim());

  if (localTables > 0 && !yes && !(await confirm('\nThis replaces everything in your local database. Continue?'))) {
    console.log('Cancelled');
    return false;
  }

  // Dump first, so a failed dump leaves the local database untouched
  console.log(`\n📥 Dumping the public schema from ${hostOf('SYNC_REMOTE_DB_URL')}...`);
  compose([
    'exec', '-T', 'db', 'pg_dump', process.env.SYNC_REMOTE_DB_URL!,
    '--schema=public',
    // Supabase's roles (anon, authenticated, service_role...) don't exist locally
    '--no-owner', '--no-privileges',
    '--format=custom', `--file=${DUMP_PATH}`,
  ], { label: 'pg_dump' });

  try {
    console.log('♻️  Replacing the local database...');
    // Also drops tables that only exist locally, e.g. from an unmerged migration
    psql('DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;', 'Clearing the local database');
    compose([
      'exec', '-T', 'db', 'pg_restore', '-U', DB_USER, '-d', DB_NAME,
      '--clean', '--if-exists', '--no-owner', '--no-privileges',
      '--single-transaction', '--exit-on-error',
      DUMP_PATH,
    ], { label: 'pg_restore' });
  } finally {
    compose(['exec', '-T', 'db', 'rm', '-f', DUMP_PATH], { label: 'Removing the dump', allowFailure: true });
  }

  console.log('🧱 Applying migrations newer than the snapshot...');
  // Inherits this process's env, so it targets the same local database the guards checked
  execSync('pnpm exec prisma migrate deploy', { stdio: 'inherit' });

  console.log('🕶️  Scrubbing personal data...');
  compose(
    ['exec', '-T', 'db', 'psql', '-U', DB_USER, '-d', DB_NAME, '-v', 'ON_ERROR_STOP=1', '-q', '-f', '-'],
    { label: 'Running anonymize.sql', input: fs.readFileSync(ANONYMIZE_SQL, 'utf8') },
  );

  console.log('✅ Local database is a fresh copy of prod');
  return true;
}

/** Runs SQL in the local database and returns its unaligned output. */
function psql(sql: string, label: string) {
  return compose(
    ['exec', '-T', 'db', 'psql', '-U', DB_USER, '-d', DB_NAME, '-v', 'ON_ERROR_STOP=1', '-At', '-c', sql],
    { label, capture: true },
  ).stdout;
}

function confirm(message: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(`${message} (yes/no): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes');
    });
  });
}
