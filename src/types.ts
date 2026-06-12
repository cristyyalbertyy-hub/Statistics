export type ContentTab = 'video' | 'podcast' | 'infographic' | 'questionnaire'

export interface SyllabusNode {
  id: string
  title: string
  children?: SyllabusNode[]
}

export interface LeafSelection {
  path: string[]
  leafId: string
  title: string
}
