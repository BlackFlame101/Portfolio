/** Resolve a public asset path while respecting Vite's configured base path. */
export function assetUrl(path: string): string {
  const normalizedPath = path.replace(/^\/+/, '')
  return `${import.meta.env.BASE_URL}${normalizedPath}`
}
