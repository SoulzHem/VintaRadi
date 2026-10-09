export function isPlayableStreamUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !/\.(?:m3u8?|pls|xspf|asx)$/i.test(url.pathname);
  } catch {
    return false;
  }
}
