import { spawnSync } from 'child_process';

type ComposeOptions = {
  /** Shown in errors instead of the command, which can contain credentials */
  label: string;
  /** Capture stdout/stderr instead of printing them */
  capture?: boolean;
  /** Return a non-zero exit status instead of throwing */
  allowFailure?: boolean;
  /** Written to the command's stdin */
  input?: string;
};

/** Runs `docker compose <args>` from the repo root and waits for it to finish. */
export function compose(args: string[], { label, capture = false, allowFailure = false, input }: ComposeOptions) {
  const result = spawnSync('docker', ['compose', ...args], {
    encoding: 'utf8',
    input,
    stdio: [input === undefined ? 'inherit' : 'pipe', capture ? 'pipe' : 'inherit', capture ? 'pipe' : 'inherit'],
  });

  if (result.error) {
    if ((result.error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error("Docker isn't installed or isn't on PATH. Install Docker Desktop: https://docs.docker.com/desktop/");
    }
    throw result.error;
  }
  if (result.status !== 0 && !allowFailure) {
    const details = capture ? result.stderr.trim() || result.stdout.trim() : '';
    throw new Error(`${label} failed (exit ${result.status})${details ? `:\n${details}` : ''}`);
  }

  return { status: result.status, stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
}

/** Runs a Garage CLI command inside the storage container. */
export function garage(args: string[], options: ComposeOptions) {
  return compose(['exec', '-T', 'storage', '/garage', ...args], options);
}
