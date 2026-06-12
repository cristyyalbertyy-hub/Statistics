import { useState } from 'react'
import type { LeafSelection, SyllabusNode } from '../types'
import { buildLeafId } from '../data/syllabus'

interface AccordionMenuProps {
  nodes: SyllabusNode[]
  chapterId: string
  chapterTitle: string
  path: string[]
  selectedLeafId: string | null
  onSelectLeaf: (selection: LeafSelection) => void
  depth?: number
}

function isLeaf(node: SyllabusNode): boolean {
  return !node.children || node.children.length === 0
}

export function AccordionMenu({
  nodes,
  chapterId,
  chapterTitle,
  path,
  selectedLeafId,
  onSelectLeaf,
  depth = 0,
}: AccordionMenuProps) {
  return (
    <ul className={`accordion-list depth-${depth}`}>
      {nodes.map((node) => (
        <AccordionItem
          key={node.id}
          node={node}
          chapterId={chapterId}
          chapterTitle={chapterTitle}
          path={[...path, node.title]}
          selectedLeafId={selectedLeafId}
          onSelectLeaf={onSelectLeaf}
          depth={depth}
        />
      ))}
    </ul>
  )
}

interface AccordionItemProps {
  node: SyllabusNode
  chapterId: string
  chapterTitle: string
  path: string[]
  selectedLeafId: string | null
  onSelectLeaf: (selection: LeafSelection) => void
  depth: number
}

function AccordionItem({
  node,
  chapterId,
  chapterTitle,
  path,
  selectedLeafId,
  onSelectLeaf,
  depth,
}: AccordionItemProps) {
  const leaf = isLeaf(node)
  const leafKey = buildLeafId(chapterId, node.id)
  const isSelected = selectedLeafId === leafKey
  const [expanded, setExpanded] = useState(depth === 0)

  if (leaf) {
    return (
      <li className="accordion-item leaf">
        <button
          type="button"
          className={`accordion-leaf-btn${isSelected ? ' selected' : ''}`}
          onClick={() =>
            onSelectLeaf({
              path: [...path],
              leafId: leafKey,
              title: node.title,
            })
          }
        >
          <span className="leaf-dot" aria-hidden="true" />
          {node.title}
        </button>
      </li>
    )
  }

  return (
    <li className="accordion-item branch">
      <button
        type="button"
        className={`accordion-branch-btn depth-${depth}`}
        aria-expanded={expanded}
        onClick={() => setExpanded((open) => !open)}
      >
        <span className={`chevron${expanded ? ' open' : ''}`} aria-hidden="true">
          ›
        </span>
        {node.title}
      </button>
      {expanded && (
        <AccordionMenu
          nodes={node.children!}
          chapterId={chapterId}
          chapterTitle={chapterTitle}
          path={path}
          selectedLeafId={selectedLeafId}
          onSelectLeaf={onSelectLeaf}
          depth={depth + 1}
        />
      )}
    </li>
  )
}

interface ChapterAccordionProps {
  chapter: SyllabusNode
  selectedLeafId: string | null
  onSelectLeaf: (selection: LeafSelection) => void
  defaultOpen?: boolean
}

export function ChapterAccordion({
  chapter,
  selectedLeafId,
  onSelectLeaf,
  defaultOpen = false,
}: ChapterAccordionProps) {
  const [expanded, setExpanded] = useState(defaultOpen)
  const hasSelectedChild =
    selectedLeafId !== null && selectedLeafId.startsWith(`${chapter.id}/`)

  return (
    <section className={`chapter-accordion${hasSelectedChild ? ' has-selection' : ''}`}>
      <button
        type="button"
        className="chapter-header"
        aria-expanded={expanded}
        onClick={() => setExpanded((open) => !open)}
      >
        <span className={`chevron chapter-chevron${expanded ? ' open' : ''}`} aria-hidden="true">
          ›
        </span>
        <span className="chapter-title">{chapter.title}</span>
      </button>
      {expanded && chapter.children && (
        <AccordionMenu
          nodes={chapter.children}
          chapterId={chapter.id}
          chapterTitle={chapter.title}
          path={[chapter.title]}
          selectedLeafId={selectedLeafId}
          onSelectLeaf={onSelectLeaf}
        />
      )}
    </section>
  )
}
