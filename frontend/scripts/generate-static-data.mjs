import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

function normalizeApiBaseUrl(rawUrl) {
  const fallbackUrl = 'http://localhost:3000/api'
  if (!rawUrl) {
    return fallbackUrl
  }

  const normalized = rawUrl.replace(/\/+$/, '')
  return normalized.endsWith('/api') ? normalized : `${normalized}/api`
}

async function fetchJson(baseUrl, endpoint) {
  const response = await fetch(`${baseUrl}${endpoint}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint} (${response.status} ${response.statusText})`)
  }

  return response.json()
}

async function writeStaticJson(fileName, payload) {
  const outputDir = path.resolve(process.cwd(), 'public', 'data')
  await mkdir(outputDir, { recursive: true })
  const filePath = path.join(outputDir, fileName)
  await writeFile(filePath, JSON.stringify(payload, null, 2), 'utf8')
  console.log(`Generated ${filePath}`)
}

async function main() {
  // Build-time source URL for static snapshot generation.
  // STATIC_DATA_API_URL is preferred so we can keep runtime Vite vars independent.
  const apiBaseUrl = normalizeApiBaseUrl(
    process.env.STATIC_DATA_API_URL ??
      process.env.VITE_API_URL ??
      process.env.VITE_API_BASE_URL,
  )

  console.log(`Fetching static data from: ${apiBaseUrl}`)

  const [products, categories] = await Promise.all([
    fetchJson(apiBaseUrl, '/products'),
    fetchJson(apiBaseUrl, '/products/categories'),
  ])

  await Promise.all([
    writeStaticJson('products.json', products),
    writeStaticJson('categories.json', categories),
  ])
}

main().catch((error) => {
  console.error('generate:data failed')
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
