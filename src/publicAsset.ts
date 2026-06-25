/** Sufixo de cache (ex.: ?v=abc1234 na Vercel, por commit) para ficheiros em public/. */
export function publicAsset(path: string): string {
  const base = path.split('?')[0]!
  return `${base}${__ASSET_Q__}`
}

export function remapContentPath(path: string, pattern: RegExp, replacement: string): string {
  const base = path.split('?')[0]!
  return publicAsset(base.replace(pattern, replacement))
}
