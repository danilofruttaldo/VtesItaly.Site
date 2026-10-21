/**
 * First and last commit day (YYYY-MM-DD) of each content file, from one
 * `git log` over src/content. These are the real publication and update days:
 * a post's `date` is the day of its event, often weeks after the post went up.
 *
 * Empty when git is missing or the clone is shallow (a shallow history would
 * date every file to the last commit): callers fall back to the frontmatter.
 * CI checks out the full history for the build (fetch-depth: 0).
 */
import { execFileSync } from 'node:child_process';

export interface GitDates {
  created: string;
  modified: string;
}

const cache = new Map<string, Map<string, GitDates>>();

function git(args: string[], cwd: string): string {
  return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 << 20 });
}

/** Parses `git log --format=@%cs --name-only` output (newest commit first). */
export function parseGitLog(log: string): Map<string, GitDates> {
  const dates = new Map<string, GitDates>();
  let day = '';
  for (const line of log.split('\n')) {
    if (line.startsWith('@')) {
      day = line.slice(1).trim();
      continue;
    }
    const file = line.trim();
    if (!file || !day) continue;
    const seen = dates.get(file);
    if (seen) seen.created = day;
    else dates.set(file, { created: day, modified: day });
  }
  return dates;
}

/** Repo-relative path (forward slashes) -> commit days. */
export function contentGitDates(root = process.cwd()): Map<string, GitDates> {
  let dates = cache.get(root);
  if (dates) return dates;
  try {
    const shallow = git(['rev-parse', '--is-shallow-repository'], root).trim() !== 'false';
    dates = shallow ? new Map() : parseGitLog(git(['log', '--format=@%cs', '--name-only', '--', 'src/content'], root));
  } catch {
    dates = new Map();
  }
  cache.set(root, dates);
  return dates;
}
