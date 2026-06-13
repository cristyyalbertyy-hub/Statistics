import { useEffect, useState } from 'react'
import type { ContentTab, LeafSelection } from '../types'
import { getContentFileHint, getContentPath, SYLLABUS_TITLE } from '../data/syllabus'
import { parseQuestionnaireCsv, type QuestionnaireItem } from '../utils/questionnaire'

const TABS: { id: ContentTab; label: string; icon: string }[] = [
  { id: 'video', label: 'Video', icon: '▶' },
  { id: 'podcast', label: 'Podcast', icon: '♫' },
  { id: 'infographic', label: 'Infographic', icon: '◫' },
  { id: 'questionnaire', label: 'Questionnaire', icon: '?' },
]

interface ContentPanelProps {
  selection: LeafSelection | null
  onBackToHome: () => void
}

export function ContentPanel({ selection, onBackToHome }: ContentPanelProps) {
  const [activeTab, setActiveTab] = useState<ContentTab>('video')
  const [assetExists, setAssetExists] = useState<boolean | null>(null)
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireItem[] | null>(null)

  useEffect(() => {
    setActiveTab('video')
  }, [selection?.leafId])

  useEffect(() => {
    if (!selection) {
      setAssetExists(null)
      setQuestionnaire(null)
      return
    }

    const path = getContentPath(selection.leafId, activeTab)
    let cancelled = false

    fetch(path, { method: 'HEAD' })
      .then((res) => {
        if (!cancelled) setAssetExists(res.ok)
      })
      .catch(() => {
        if (!cancelled) setAssetExists(false)
      })

    if (activeTab === 'questionnaire') {
      fetch(path)
        .then((res) => (res.ok ? res.text() : null))
        .then((text) => {
          if (!cancelled) setQuestionnaire(text ? parseQuestionnaireCsv(text) : null)
        })
        .catch(() => {
          if (!cancelled) setQuestionnaire(null)
        })
    } else {
      setQuestionnaire(null)
    }

    return () => {
      cancelled = true
    }
  }, [selection, activeTab])

  if (!selection) {
    return (
      <div className="content-panel empty">
        <div className="welcome-card">
          <img
            src="/M_S_I.png"
            alt={`${SYLLABUS_TITLE} overview`}
            className="welcome-infographic"
          />
          <h1>{SYLLABUS_TITLE}</h1>
          <p>
            Select a topic from the sidebar to access the video lecture, podcast,
            infographic, and questionnaire for that subchapter.
          </p>
          <div className="resource-preview">
            {TABS.map((tab) => (
              <div key={tab.id} className="resource-chip">
                <span className="chip-icon">{tab.icon}</span>
                {tab.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const contentPath = getContentPath(selection.leafId, activeTab)

  return (
    <div className="content-panel">
      <header className="content-header">
        <button type="button" className="back-home-btn" onClick={onBackToHome}>
          <span className="back-home-icon" aria-hidden="true">←</span>
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
          <VideoContent path={contentPath} exists={assetExists} title={selection.title} />
        )}
        {activeTab === 'podcast' && (
          <PodcastContent path={contentPath} exists={assetExists} title={selection.title} />
        )}
        {activeTab === 'infographic' && (
          <InfographicContent path={contentPath} exists={assetExists} title={selection.title} />
        )}
        {activeTab === 'questionnaire' && (
          <QuestionnaireContent
            items={questionnaire}
            exists={assetExists}
            title={selection.title}
            leafId={selection.leafId}
          />
        )}
      </div>
    </div>
  )
}

function Placeholder({ type, title, leafId }: { type: string; title: string; leafId?: string }) {
  const folder = leafId ? `public/content/${leafId}/` : 'public/content/{chapter}/{topic}/'
  const hint = leafId ? getContentFileHint(leafId) : '{PREFIX}_V.mp4, {PREFIX}_P.m4a, {PREFIX}_I.png, {PREFIX}_Q.csv'

  return (
    <div className="content-placeholder">
      <div className="placeholder-icon">{type[0]}</div>
      <h2>{type} coming soon</h2>
      <p>
        Add your {type.toLowerCase()} file for <strong>{title}</strong> to:
      </p>
      <code>{folder}{hint}</code>
    </div>
  )
}

function VideoContent({
  path,
  exists,
  title,
}: {
  path: string
  exists: boolean | null
  title: string
}) {
  if (exists === false) return <Placeholder type="Video" title={title} />
  if (exists === null) return <div className="loading">Loading…</div>

  return (
    <div className="media-wrapper">
      <video controls src={path} className="video-player">
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

function PodcastContent({
  path,
  exists,
  title,
}: {
  path: string
  exists: boolean | null
  title: string
}) {
  if (exists === false) return <Placeholder type="Podcast" title={title} />
  if (exists === null) return <div className="loading">Loading…</div>

  return (
    <div className="media-wrapper podcast">
      <div className="podcast-art" aria-hidden="true">♫</div>
      <audio controls src={path} className="audio-player">
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
  if (exists === false) return <Placeholder type="Infographic" title={title} />
  if (exists === null) return <div className="loading">Loading…</div>

  return (
    <div className="infographic-wrapper">
      <img src={path} alt={`Infographic: ${title}`} className="infographic-img" />
    </div>
  )
}

function QuestionnaireContent({
  items,
  exists,
  title,
  leafId,
}: {
  items: QuestionnaireItem[] | null
  exists: boolean | null
  title: string
  leafId: string
}) {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setRevealed({})
  }, [leafId])

  if (exists === false) return <Placeholder type="Questionnaire" title={title} leafId={leafId} />
  if (exists === null || !items) return <div className="loading">Loading…</div>

  return (
    <div className="questionnaire">
      <h2>{title} — Questionnaire</h2>
      <p className="questionnaire-intro">
        Review each question, then reveal the answer to check your understanding.
      </p>
      <ol className="question-list">
        {items.map((item, index) => (
          <li key={item.id} className="question-block">
            <p className="question-text">
              <span className="question-number">{index + 1}.</span> {item.question}
            </p>
            <button
              type="button"
              className="reveal-btn"
              aria-expanded={revealed[item.id] ?? false}
              onClick={() => setRevealed((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
            >
              {revealed[item.id] ? 'Hide answer' : 'Reveal answer'}
            </button>
            {revealed[item.id] && (
              <p className="answer-text" role="region" aria-label={`Answer to question ${index + 1}`}>
                {item.answer}
              </p>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
