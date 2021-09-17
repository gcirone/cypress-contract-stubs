export function workdir(): string {
  return process.env.INIT_CWD || process.env.PWD || process.cwd();
}

export function filePattern(pattern: string): string {
  if (process.platform === 'win32') {
    return pattern.replace(/\\/g, '/');
  } else {
    return pattern;
  }
}
