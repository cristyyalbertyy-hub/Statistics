export interface QuestionnaireItem {
  id: string
  question: string
  answer: string
}

export function parseQuestionnaireCsv(text: string): QuestionnaireItem[] {
  const items: QuestionnaireItem[] = []

  for (const line of text.trim().split(/\r?\n/)) {
    if (!line.trim()) continue

    const fields = parseCsvLine(line)
    if (fields.length < 2) continue

    const question = fields[0].trim()
    const answer = fields.slice(1).join(',').trim()
    if (!question || !answer) continue

    items.push({
      id: `q${items.length + 1}`,
      question,
      answer,
    })
  }

  return items
}

function parseCsvLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      fields.push(current)
      current = ''
      continue
    }

    current += char
  }

  fields.push(current)
  return fields
}
