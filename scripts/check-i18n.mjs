import { readFileSync } from 'node:fs'

const english = JSON.parse(readFileSync(new URL('../src/locales/en.json', import.meta.url), 'utf8'))
const french = JSON.parse(readFileSync(new URL('../src/locales/fr.json', import.meta.url), 'utf8'))

function flattenKeys(value, prefix = '') {
  return Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key
    return typeof child === 'object' && child !== null ? flattenKeys(child, path) : [path]
  })
}

const englishKeys = new Set(flattenKeys(english))
const frenchKeys = new Set(flattenKeys(french))
const missingInFrench = [...englishKeys].filter((key) => !frenchKeys.has(key))
const missingInEnglish = [...frenchKeys].filter((key) => !englishKeys.has(key))

if (missingInFrench.length || missingInEnglish.length) {
  console.error(JSON.stringify({ missingInFrench, missingInEnglish }, null, 2))
  process.exitCode = 1
} else {
  console.log(`Locale keys match (${englishKeys.size} keys).`)
}
