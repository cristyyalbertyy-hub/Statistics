import { useState } from 'react'
import { syllabus, SYLLABUS_TITLE } from './data/syllabus'
import { ChapterAccordion } from './components/AccordionMenu'
import { ContentPanel } from './components/ContentPanel'
import type { LeafSelection } from './types'
import './App.css'

function App() {
  const [selection, setSelection] = useState<LeafSelection | null>(null)

  return (
    <div className="app">
      <aside className="sidebar" aria-label="Course navigation">
        <div className="sidebar-header">
          <h2 className="sidebar-title">{SYLLABUS_TITLE}</h2>
        </div>
        <nav className="chapter-nav">
          {syllabus.map((chapter, index) => (
            <ChapterAccordion
              key={chapter.id}
              chapter={chapter}
              selectedLeafId={selection?.leafId ?? null}
              onSelectLeaf={setSelection}
              defaultOpen={index === 0}
            />
          ))}
        </nav>
      </aside>
      <main className="main">
        <ContentPanel selection={selection} />
      </main>
    </div>
  )
}

export default App
