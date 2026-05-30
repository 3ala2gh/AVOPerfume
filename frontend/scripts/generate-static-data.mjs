import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

function getCandidateBaseUrls(rawUrl) {
  const fallbackUrl = 'http://localhost:3000'
  const normalizedRaw = (rawUrl ?? fallbackUrl).replace(/\/+$/, '')

  // Try both styles because some deployments expose routes under /api
  // while others expose them at root.
  const withoutApi = normalizedRaw.endsWith('/api')
    ? normalizedRaw.slice(0, -4)
    : normalizedRaw
  const withApi = normalizedRaw.endsWith('/api') ? normalizedRaw : `${normalizedRaw}/api`

  return Array.from(new Set([withApi, withoutApi]))
}

async function fetchJson(candidates, endpoint) {
  let lastError = null

  for (const baseUrl of candidates) {
    const response = await fetch(`${baseUrl}${endpoint}`)
    if (response.ok) {
      return response.json()
    }

    lastError = new Error(
      `Failed to fetch ${endpoint} from ${baseUrl} (${response.status} ${response.statusText})`,
    )
  }

  throw lastError ?? new Error(`Failed to fetch ${endpoint}`)
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
  const candidateBaseUrls = getCandidateBaseUrls(
    process.env.STATIC_DATA_API_URL ??
      process.env.VITE_API_URL ??
      process.env.VITE_API_BASE_URL,
  )

  console.log(`Fetching static data from candidates: ${candidateBaseUrls.join(', ')}`)

  const [products, categories] = await Promise.all([
    fetchJson(candidateBaseUrls, '/products'),
    fetchJson(candidateBaseUrls, '/products/categories'),
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
