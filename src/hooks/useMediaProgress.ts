import { useCallback, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { getFirestoreDb, PACKAGE_ID } from '../lib/firebase'
import { progressDocId, recordWatchComplete, type AutoResource } from '../lib/progress-client'

/** Progress dashboard item ids omit the chapter prefix (e.g. populations-and-samples). */
export function progressItemKeyForFirebase(leafKey: string | undefined): string | undefined {
  if (!leafKey) return undefined
  const slash = leafKey.indexOf('/')
  return slash >= 0 ? leafKey.slice(slash + 1) : leafKey
}

export function useMediaProgress(leafKey: string | undefined) {
  const { user } = useAuth()
  const itemKey = progressItemKeyForFirebase(leafKey)

  const saveWatchComplete = useCallback(
    async (resource: AutoResource): Promise<boolean> => {
      if (!itemKey) return false
      if (!user) {
        console.warn('Progress not saved — sign in via My account to sync video progress.')
        return false
      }
      try {
        const level = await recordWatchComplete(
          getFirestoreDb(),
          user.uid,
          PACKAGE_ID,
          itemKey,
          resource,
        )
        console.info('Progress saved:', { packageId: PACKAGE_ID, itemKey, resource, level })
        return true
      } catch (err) {
        const id = progressDocId(user.uid, PACKAGE_ID, itemKey, resource)
        console.warn('Could not save watch progress:', { id, packageId: PACKAGE_ID, itemKey, resource, err })
        return false
      }
    },
    [user, itemKey],
  )

  const saveRef = useRef(saveWatchComplete)
  saveRef.current = saveWatchComplete

  const onVideoComplete = useCallback((): Promise<boolean> => {
    return saveRef.current('V')
  }, [])

  const onPodcastComplete = useCallback((): Promise<boolean> => {
    return saveRef.current('P')
  }, [])

  return { onVideoComplete, onPodcastComplete, trackWatchComplete: saveWatchComplete }
}
