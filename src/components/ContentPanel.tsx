import { useEffect, useRef, useState } from 'react'
import type { ContentTab, LeafSelection } from '../types'
import { getExtraVideoPath } from '../data/syllabus'
import { remapContentPath } from '../publicAsset'
import { useMediaProgress } from '../hooks/useMediaProgress'
import { bindPlaybackProgress, catchUpPlaybackProgress } from '../lib/playbackProgress'
import { useAuth } from '../context/AuthContext'
import {
  checkAssetExists,
  getInfographicCompanionPdfPaths,
  resolveContentPath,
} from '../utils/contentAssets'
import { parseQuestionnaireCsv, type QuestionnaireItem } from '../utils/questionnaire'

const TABS: { id: ContentTab; label: string; icon: string }[] = [
  { id: 'video', label: 'Video', icon: '▶' },
  { id: 'podcast', label: 'Podcast', icon: '♫' },
  { id: 'infographic', label: 'Infographic', icon: '◫' },
  { id: 'questionnaire', label: 'Questionnaire', icon: '?' },
]

interface ContentPanelProps {
  selection: LeafSelection
  onBackToHome: () => void
}

export function ContentPanel({ selection, onBackToHome }: ContentPanelProps) {
  const [activeTab, setActiveTab] = useState<ContentTab>('video')
  const [resolvedPath, setResolvedPath] = useState<string | null | undefined>(undefined)
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireItem[] | null>(null)

  useEffect(() => {
    setActiveTab('video')
  }, [selection.leafId])

  useEffect(() => {
    let cancelled = false
    setResolvedPath(undefined)
    setQuestionnaire(null)

    resolveContentPath(selection.leafId, activeTab).then((path) => {
      if (cancelled) return
      setResolvedPath(path)

      if (activeTab === 'questionnaire' && path) {
        fetch(path)
          .then((res) => (res.ok ? res.text() : null))
          .then((text) => {
            if (!cancelled) setQuestionnaire(text ? parseQuestionnaireCsv(text) : null)
          })
          .catch(() => {
            if (!cancelled) setQuestionnaire(null)
          })
      }
    })

    return () => {
      cancelled = true
    }
  }, [selection, activeTab])

  const assetExists = resolvedPath === undefined ? null : resolvedPath !== null

  return (
    <div className="content-panel">
      <header className="content-header subchapter-head">
        <button type="button" className="back-home-btn" onClick={onBackToHome}>
          <span className="back-home-icon" aria-hidden="true">
            ←
          </span>
          Back to overview
        </button>
        <nav className="breadcrumb" aria-label="Breadcrumb">
          {selection.path.map((segment, i) => (
            <span key={`${segment}-${i}`}>
              {i > 0 && <span className="breadcrumb-sep"> / </span>}
              {segment}
            </span>
          ))}
        </nav>
        <h1>{selection.title}</h1>
      </header>

      <div className="content-tabs" role="tablist" aria-label="Content types">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`content-tab${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="content-body" role="tabpanel">
        {activeTab === 'video' && (
          <VideoContent
            path={resolvedPath ?? ''}
            leafId={selection.leafId}
            exists={assetExists}
            title={selection.title}
          />
        )}
        {activeTab === 'podcast' && (
          <PodcastContent
            path={resolvedPath ?? ''}
            exists={assetExists}
            title={selection.title}
            leafId={selection.leafId}
          />
        )}
        {activeTab === 'infographic' && (
          <InfographicContent
            path={resolvedPath ?? ''}
            exists={assetExists}
            title={selection.title}
          />
        )}
        {activeTab === 'questionnaire' && (
          <QuestionnaireContent items={questionnaire} exists={assetExists} title={selection.title} />
        )}
      </div>
    </div>
  )
}

function Placeholder({ type, title }: { type: string; title: string }) {
  return (
    <div className="content-placeholder">
      <div className="placeholder-icon">{type[0]}</div>
      <h2>{type} coming soon</h2>
      <p>
        The {type.toLowerCase()} for <strong>{title}</strong> is not available yet.
      </p>
    </div>
  )
}

function VideoContent({
  path,
  leafId,
  exists,
  title,
}: {
  path: string
  leafId: string
  exists: boolean | null
  title: string
}) {
  const [extraPath, setExtraPath] = useState<string | null>(null)
  const { user } = useAuth()
  const { onVideoComplete } = useMediaProgress(leafId)
  const primaryVideoRef = useRef<HTMLVideoElement>(null)
  const extraVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = primaryVideoRef.current
    if (!el || !path) return
    return bindPlaybackProgress(el, onVideoComplete)
  }, [path, onVideoComplete])

  useEffect(() => {
    const el = extraVideoRef.current
    if (!el || !extraPath) return
    return bindPlaybackProgress(el, onVideoComplete)
  }, [extraPath, onVideoComplete])

  useEffect(() => {
    if (!user) return
    for (const el of [primaryVideoRef.current, extraVideoRef.current]) {
      if (el) catchUpPlaybackProgress(el, onVideoComplete)
    }
  }, [user, onVideoComplete, path, extraPath])

  useEffect(() => {
    if (!path) {
      setExtraPath(null)
      return
    }

    let cancelled = false
    const candidates = [
      remapContentPath(path, /_V\.mp4$/, '_V2.mp4'),
      getExtraVideoPath(leafId),
    ]

    Promise.all(candidates.map((candidate) => checkAssetExists(candidate).then((ok) => (ok ? candidate : null))))
      .then((results) => {
        if (!cancelled) setExtraPath(results.find((candidate): candidate is string => candidate !== null) ?? null)
      })
      .catch(() => {
        if (!cancelled) setExtraPath(null)
      })

    return () => {
      cancelled = true
    }
  }, [leafId, path])

  if (exists === false) return <Placeholder type="Video" title={title} />
  if (exists === null) return <div className="loading">Loading…</div>

  return (
    <div className={`media-wrapper${extraPath ? ' video-stack' : ''}`} onContextMenu={(event) => event.preventDefault()}>
      <video ref={primaryVideoRef} controls controlsList="nodownload" playsInline src={path} className="video-player">
        Your browser does not support the video tag.
      </video>
      {extraPath && (
        <video ref={extraVideoRef} controls controlsList="nodownload" playsInline src={extraPath} className="video-player">
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  )
}

function PodcastContent({
  path,
  exists,
  title,
  leafId,
}: {
  path: string
  exists: boolean | null
  title: string
  leafId: string
}) {
  const { onPodcastComplete } = useMediaProgress(leafId)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const el = audioRef.current
    if (!el || !path) return
    return bindPlaybackProgress(el, onPodcastComplete)
  }, [path, onPodcastComplete])
  if (exists === false) return <Placeholder type="Podcast" title={title} />
  if (exists === null) return <div className="loading">Loading…</div>

  return (
    <div className="media-wrapper podcast" onContextMenu={(event) => event.preventDefault()}>
      <div className="podcast-art" aria-hidden="true">
        ♫
      </div>
      <audio ref={audioRef} controls controlsList="nodownload" src={path} className="audio-player">
        Your browser does not support the audio element.
      </audio>
    </div>
  )
}

function InfographicContent({
  path,
  exists,
  title,
}: {
  path: string
  exists: boolean | null
  title: string
}) {
  const pdfSections = [
    { suffix: '_I.pdf', title: `${title} — infographic (PDF)` },
    { suffix: '_T2.pdf', title: `${title} — supplementary text` },
    { suffix: '_T.pdf', title: `${title} — text` },
  ]
  const [visiblePdfs, setVisiblePdfs] = useState<{ path: string; title: string }[]>([])

  useEffect(() => {
    if (!path) {
      setVisiblePdfs([])
      return
    }

    let cancelled = false
    const candidates = getInfographicCompanionPdfPaths(path)

    Promise.all(
      candidates.map(async (pdfPath, index) => {
        if (!(await checkAssetExists(pdfPath))) return null
        return { path: pdfPath, title: pdfSections[index]?.title ?? `${title} — PDF` }
      }),
    )
      .then((results) => {
        if (!cancelled) {
          setVisiblePdfs(results.filter((section): section is { path: string; title: string } => section !== null))
        }
      })
      .catch(() => {
        if (!cancelled) setVisiblePdfs([])
      })

    return () => {
      cancelled = true
    }
  }, [path, title])

  if (exists === false) return <Placeholder type="Infographic" title={title} />
  if (exists === null) return <div className="loading">Loading…</div>

  return (
    <div className="infographic-wrapper">
      <img src={path} alt={`Infographic: ${title}`} className="infographic-img" />
      {visiblePdfs.map((section) => (
        <iframe
          key={section.path}
          src={section.path}
          title={section.title}
          className="infographic-pdf"
        />
      ))}
    </div>
  )
}

function QuestionnaireContent({
  items,
  exists,
  title,
}: {
  items: QuestionnaireItem[] | null
  exists: boolean | null
  title: string
}) {
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    setIndex(0)
    setRevealed(false)
  }, [title, items])

  if (exists === false) return <Placeholder type="Questionnaire" title={title} />
  if (exists === null || !items) return <div className="loading">Loading…</div>
  if (items.length === 0) return <p className="muted">No questions in this file.</p>

  const card = items[index]!
  const atStart = index === 0
  const atEnd = index >= items.length - 1

  const goPrevious = () => {
    if (atStart) return
    setIndex((i) => i - 1)
    setRevealed(false)
  }

  const goNext = () => {
    if (atEnd) return
    setIndex((i) => i + 1)
    setRevealed(false)
  }

  return (
    <div className="questionnaire">
      <p className="questionnaire__progress">
        Question {index + 1} of {items.length}
      </p>

      <div className="questionnaire__nav-row">
        <button
          type="button"
          className="questionnaire__arrow"
          onClick={goPrevious}
          disabled={atStart}
          aria-label="Previous question"
        >
          ←
        </button>

        <div className="questionnaire__card">
          <p className="questionnaire__question">{card.question}</p>
          {revealed ? (
            <div className="questionnaire__answer">
              <span className="questionnaire__answer-label">Answer</span>
              <p>{card.answer}</p>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          className="questionnaire__arrow"
          onClick={goNext}
          disabled={atEnd}
          aria-label="Next question"
        >
          →
        </button>
      </div>

      {!revealed ? (
        <button type="button" className="questionnaire__reveal" onClick={() => setRevealed(true)}>
          Show answer
        </button>
      ) : null}
    </div>
  )
}
