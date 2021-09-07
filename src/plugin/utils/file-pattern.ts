export function filePattern(pattern: string): string {
  if (process.platform === 'win32') {
    return pattern.replace(/\\/g, '/');
  } else {
    return pattern;
  }
}
