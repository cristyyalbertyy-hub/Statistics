import { useEffect, useMemo, useRef, useState } from 'react'
import { syllabus, SYLLABUS_TITLE } from './data/syllabus'
import { ChapterAccordion } from './components/AccordionMenu'
import { ContentPanel } from './components/ContentPanel'
import type { LeafSelection } from './types'
import { ProgressSessionBanner } from './components/ProgressSessionBanner'
import { useAuth } from './context/AuthContext'
import { publicAsset } from './publicAsset'
import './App.css'

function collapsedChapters(): Record<string, boolean> {
  const init: Record<string, boolean> = {}
  for (const chapter of syllabus) init[chapter.id] = false
  return init
}

function countTopics(chapterId: string): number {
  const chapter = syllabus.find((c) => c.id === chapterId)
  return chapter?.children?.length ?? 0
}

export default function App() {
  const { userEmail, needsReauth, logout } = useAuth()
  const [openChapters, setOpenChapters] = useState(() => collapsedChapters())
  const [selection, setSelection] = useState<LeafSelection | null>(null)
  const [atHome, setAtHome] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(true)
  const mainRef = useRef<HTMLElement>(null)

  const activeChapter = useMemo(() => {
    if (!selection) return null
    const chapterId = selection.leafId.split('/')[0]
    return syllabus.find((c) => c.id === chapterId) ?? null
  }, [selection])

  const mobileLessonContext = useMemo(() => {
    if (!selection || !activeChapter) return null
    return {
      chapter: activeChapter.title,
      subchapter: selection.title,
      color: activeChapter.color ?? '#14213d',
    }
  }, [selection, activeChapter])

  const showMobileLessonBar = !mobileMenuOpen && !atHome && mobileLessonContext !== null
  const shellMode = mobileMenuOpen ? 'is-mobile-menu' : 'is-mobile-content'
  const overviewImage = publicAsset('StatisticsA.png')

  const selectLeaf = (sel: LeafSelection) => {
    setAtHome(false)
    setSelection(sel)
    setMobileMenuOpen(false)

    const chapterId = sel.leafId.split('/')[0]!
    const nextOpen = collapsedChapters()
    nextOpen[chapterId] = true
    setOpenChapters(nextOpen)
  }

  const goToEntry = () => {
    setAtHome(true)
    setSelection(null)
    setMobileMenuOpen(false)
    setOpenChapters(collapsedChapters())
  }

  const openMobileMenu = () => {
    setMobileMenuOpen(true)
  }

  useEffect(() => {
    if (!selection) return
    window.scrollTo({ top: 0, behavior: 'smooth' })
    mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [selection?.leafId])

  const overviewPanel = (
    <div className="overview-panel">
      <div className="overview-intro">
        <p className="overview-lead">
          From data basics to study design — six chapters with video, podcast, infographic and
          questionnaire for each topic.
        </p>
        <ul className="overview-chapters" aria-label="Course chapters">
          {syllabus.map((chapter) => (
            <li
              key={chapter.id}
              className="overview-chapters__item"
              style={{ borderLeftColor: chapter.color ?? '#14213d' }}
            >
              <strong>{chapter.title}</strong>
              <span>
                {countTopics(chapter.id)} {countTopics(chapter.id) === 1 ? 'topic' : 'topics'}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <img
        src={overviewImage}
        alt={`${SYLLABUS_TITLE} overview`}
        className="overview-infographic"
      />
      <p className="overview-hint muted">
        Open a coloured chapter below, then choose a topic to start.
      </p>
      <button type="button" className="mobile-browse-btn" onClick={() => setMobileMenuOpen(true)}>
        Browse chapters →
      </button>
    </div>
  )

  return (
    <div className={`app-shell ${shellMode}`}>
      <header className={`app-header${showMobileLessonBar ? ' app-header--compact-mobile' : ''}`}>
        <button
          type="button"
          className="home-overview-btn"
          onClick={goToEntry}
          aria-label="Back to course overview"
        >
          <span className="home-overview-btn__media">
            <img
              src={overviewImage}
              alt=""
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <span className="home-overview-btn__fallback" aria-hidden>
              ⊕
            </span>
          </span>
          <span className="home-overview-btn__label">Course overview</span>
        </button>
        <h1>{SYLLABUS_TITLE}</h1>
        {userEmail ? (
          <div className="app-header__actions">
            <div className="auth-account">
              <span className="auth-account__email" title={userEmail}>
                {userEmail}
              </span>
              <button type="button" className="btn-ghost" onClick={() => void logout()}>
                Sair
              </button>
            </div>
          </div>
        ) : null}
      </header>

      <ProgressSessionBanner visible={needsReauth} />

      {showMobileLessonBar && mobileLessonContext ? (
        <div
          className="mobile-lesson-bar"
          style={{ borderLeftColor: mobileLessonContext.color }}
        >
          <button type="button" className="mobile-menu-back" onClick={openMobileMenu}>
            ← Menu
          </button>
          <div className="mobile-lesson-bar__text">
            <span className="mobile-lesson-bar__chapter">{mobileLessonContext.chapter}</span>
            <span className="mobile-lesson-bar__sub">{mobileLessonContext.subchapter}</span>
          </div>
        </div>
      ) : null}

      <div className="layout">
        <div className="sidebar-column">
          <aside className="sidebar" aria-label="Course navigation">
            <nav className="chapter-nav">
              {syllabus.map((chapter) => (
                <ChapterAccordion
                  key={chapter.id}
                  chapter={chapter}
                  selectedLeafId={selection?.leafId ?? null}
                  onSelectLeaf={selectLeaf}
                  open={openChapters[chapter.id] ?? false}
                  onToggle={() =>
                    setOpenChapters((prev) => ({ ...prev, [chapter.id]: !prev[chapter.id] }))
                  }
                />
              ))}
            </nav>
          </aside>
        </div>

        <main
          ref={mainRef}
          className={`main${atHome ? ' main--overview' : ''}`}
          data-chapter-tint={activeChapter?.id ?? undefined}
        >
          {atHome ? (
            overviewPanel
          ) : selection ? (
            <ContentPanel selection={selection} onBackToHome={goToEntry} />
          ) : null}
        </main>
      </div>
    </div>
  )
}
