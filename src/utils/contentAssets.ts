import type { ContentTab } from '../types'
import { getContentPathCandidates } from '../data/syllabus'

export async function checkAssetExists(path: string): Promise<boolean> {
  try {
    const head = await fetch(path, { method: 'HEAD' })
    if (head.ok) return true
  } catch {
    // Some static hosts reject HEAD; fall back to a tiny ranged GET.
  }

  try {
    const ranged = await fetch(path, { headers: { Range: 'bytes=0-0' } })
    return ranged.ok || ranged.status === 206
  } catch {
    return false
  }
}

export async function resolveContentPath(
  leafKey: string,
  type: ContentTab,
): Promise<string | null> {
  for (const path of getContentPathCandidates(leafKey, type)) {
    if (await checkAssetExists(path)) return path
  }
  return null
}

export function getInfographicCompanionPdfPaths(pngPath: string): string[] {
  return [
    pngPath.replace(/_I\.png$/, '_I.pdf'),
    pngPath.replace(/_I\.png$/, '_T2.pdf'),
    pngPath.replace(/_I\.png$/, '_T.pdf'),
  ]
}
