/** Sufixo de cache (ex.: ?v=abc1234 na Vercel, por commit) para ficheiros em public/. */
export function publicAsset(path: string): string {
  const basePath = path.split('?')[0]!
  const assetPath = basePath.startsWith('/') ? basePath.slice(1) : basePath
  const origin = import.meta.env.VITE_MEDIA_ORIGIN || import.meta.env.BASE_URL
  const normalizedOrigin = origin.endsWith('/') ? origin : `${origin}/`
  return `${normalizedOrigin}${assetPath}${__ASSET_Q__}`
}

export function remapContentPath(path: string, pattern: RegExp, replacement: string): string {
  const base = path.split('?')[0]!
  return publicAsset(base.replace(pattern, replacement))
}
