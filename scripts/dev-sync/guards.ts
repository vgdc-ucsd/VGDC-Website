/**
 * The local service vars come from .env.services, which the package.json scripts
 * load before the files pulled from Vercel. Running this script any other way
 * would pick up the pulled (possibly prod) values instead. These checks make sure
 * the sync only ever writes to local services and only reads from remote ones.
 */

const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '[::1]']);
/** The port docker-compose.yml publishes Postgres on */
export const LOCAL_DB_PORT = '54322';

const SERVICES_FILE = '.env.services';

export function requireEnv(...names: string[]) {
  const missing = names.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    const hint = missing.some((name) => name.startsWith('SYNC_'))
      ? 'The SYNC_* vars come from Vercel\'s Development environment: run `vercel env pull`'
      : `Run this through its package.json script, which loads ${SERVICES_FILE}`;
    throw new Error(`Missing env vars: ${missing.join(', ')}. ${hint}`);
  }
}

/** Throws unless every one of these env vars points at this machine. */
export function assertLocal(...names: string[]) {
  requireEnv(...names);
  for (const name of names) {
    const host = parseUrl(name);
    if (!LOCAL_HOSTNAMES.has(host.hostname)) {
      throw new Error(
        `${name} points at ${host.hostname}, not this machine. Refusing to overwrite it. ` +
        `Run this through its package.json script, which loads the local value from ${SERVICES_FILE}`
      );
    }
  }
}

/** Throws unless every one of these env vars points somewhere other than this machine. */
export function assertRemote(...names: string[]) {
  requireEnv(...names);
  for (const name of names) {
    if (LOCAL_HOSTNAMES.has(parseUrl(name).hostname)) {
      throw new Error(`${name} points at this machine, but it should be the remote source to copy from`);
    }
  }
}

/** Throws unless these Postgres URLs are the docker-compose database, not some other local Postgres. */
export function assertComposeDatabase(...names: string[]) {
  for (const name of names) {
    if (parseUrl(name).port !== LOCAL_DB_PORT) {
      throw new Error(`${name} should use port ${LOCAL_DB_PORT}, the one docker-compose.yml publishes Postgres on`);
    }
  }
}

/** Hostname for logging. Never log the full URL, it contains credentials. */
export function hostOf(name: string) {
  return parseUrl(name).hostname;
}

function parseUrl(name: string) {
  try {
    return new URL(process.env[name]!);
  } catch {
    throw new Error(`${name} isn't a valid URL`);
  }
}
