/** Seconds before the end when a long clip counts as complete (within the 20–30s range). */
const COMPLETION_LEAD_SECONDS = 25

/** Shorter clips keep the legacy near-end threshold. */
const SHORT_MEDIA_MAX_SECONDS = 40

function completionThreshold(duration: number): number {
  if (!Number.isFinite(duration) || duration <= 0) return 0
  if (duration <= SHORT_MEDIA_MAX_SECONDS) {
    return Math.max(0, duration - 0.75)
  }
  return Math.max(0, duration - COMPLETION_LEAD_SECONDS)
}

export type PlaybackCompleteHandler = () => void | boolean | Promise<void | boolean>

async function invokeComplete(onComplete: PlaybackCompleteHandler): Promise<boolean> {
  try {
    const result = await onComplete()
    return result !== false
  } catch {
    return false
  }
}

function isPastThreshold(element: HTMLMediaElement): boolean {
  const duration = element.duration
  if (!Number.isFinite(duration) || duration <= 0) return false
  return element.currentTime >= completionThreshold(duration)
}

/** Re-check threshold and attempt completion (e.g. after Firebase auth becomes ready). */
export function catchUpPlaybackProgress(
  element: HTMLMediaElement,
  onComplete: PlaybackCompleteHandler,
): void {
  if (!isPastThreshold(element) && element.ended !== true) return
  void invokeComplete(onComplete)
}

/** Fire once per play-through when media reaches the completion threshold. */
export function bindPlaybackProgress(
  element: HTMLMediaElement,
  onComplete: PlaybackCompleteHandler,
): () => void {
  let tracked = false
  let pending = false

  const reset = () => {
    tracked = false
    pending = false
  }

  const completeOnce = () => {
    if (tracked || pending) return
    pending = true
    void invokeComplete(onComplete).then((ok) => {
      pending = false
      if (ok) tracked = true
    })
  }

  const maybeNearEnd = () => {
    if (tracked || pending) return
    if (isPastThreshold(element)) {
      completeOnce()
    }
  }

  element.addEventListener('play', reset)
  element.addEventListener('seeking', reset)
  element.addEventListener('ended', completeOnce)
  element.addEventListener('timeupdate', maybeNearEnd)
  element.addEventListener('loadedmetadata', maybeNearEnd)
  element.addEventListener('durationchange', maybeNearEnd)

  maybeNearEnd()

  return () => {
    element.removeEventListener('play', reset)
    element.removeEventListener('seeking', reset)
    element.removeEventListener('ended', completeOnce)
    element.removeEventListener('timeupdate', maybeNearEnd)
    element.removeEventListener('loadedmetadata', maybeNearEnd)
    element.removeEventListener('durationchange', maybeNearEnd)
  }
}
