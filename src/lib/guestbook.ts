export type GuestbookNote = {
  id: string
  name: string
  note: string
  created_at: string
}

const endpoint = import.meta.env.VITE_GUESTBOOK_API_URL?.replace(/\/$/, '')

export const guestbookReady = Boolean(endpoint)

export async function getNotes(): Promise<GuestbookNote[] | null> {
  if (!endpoint) return null
  try {
    const response = await fetch(`${endpoint}/api/notes`)
    if (!response.ok) return null
    const notes: GuestbookNote[] = await response.json()
    return Array.isArray(notes) ? notes : null
  } catch {
    return null
  }
}

export async function postNote(name: string, note: string): Promise<GuestbookNote | null> {
  if (!endpoint) return null
  try {
    const response = await fetch(`${endpoint}/api/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, note }),
    })
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}
