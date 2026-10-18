const formId = import.meta.env.VITE_FORMSPREE_ID

export const inboxReady = Boolean(formId)

export async function sendMessage(data: FormData): Promise<boolean> {
  if (!formId) return false
  try {
    const response = await fetch(`https://formspree.io/f/${encodeURIComponent(formId)}`, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
    })
    return response.ok
  } catch {
    return false
  }
}
