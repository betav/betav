#!/usr/bin/env node
/**
 * AI-powered weekly insights generator for Alpha Empire Logistics.
 * Uses Claude claude-haiku-4-5 to generate articles on logistics and trade topics.
 * All articles are submitted as pending_review — admin approval required before publishing.
 *
 * Usage:
 *   node tools/generate-weekly-insights.js
 *   node tools/generate-weekly-insights.js "Mining logistics DRC" "SA customs update"
 *
 * Required env vars:
 *   ANTHROPIC_API_KEY
 *   COWORK_EMAIL or ADMIN_EMAIL
 *   COWORK_PASSWORD or ADMIN_PASSWORD
 *   VITE_API_BASE_URL (optional, defaults to http://localhost:3001)
 */

import Anthropic from '@anthropic-ai/sdk'

const API_BASE = process.env.VITE_API_BASE_URL || process.env.API_BASE_URL || 'http://localhost:3001'
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const EMAIL = process.env.COWORK_EMAIL || process.env.ADMIN_EMAIL
const PASSWORD = process.env.COWORK_PASSWORD || process.env.ADMIN_PASSWORD

const DEFAULT_TOPICS = [
  'African transport corridors: current capacity and bottlenecks',
  'Mining logistics in the DRC: opportunities and operational challenges',
  'Cross-border trade between South Africa and DRC: regulatory updates',
  'Customs and freight clearance best practices for SA-DRC corridor',
  'Fleet operations in sub-Saharan Africa: maintenance and optimization',
  'Infrastructure projects driving logistics demand in Central Africa',
  'Regional supply chain resilience in Southern Africa',
  'Procurement opportunities in African mining sector 2025',
  'Freight and cargo trends in African emerging markets',
]

if (!ANTHROPIC_API_KEY) {
  console.error('ERROR: ANTHROPIC_API_KEY is required')
  process.exit(1)
}

if (!EMAIL || !PASSWORD) {
  console.error('ERROR: COWORK_EMAIL/COWORK_PASSWORD or ADMIN_EMAIL/ADMIN_PASSWORD required')
  process.exit(1)
}

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY })

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

async function login() {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Login failed: ${err.error || res.statusText}`)
  }
  const data = await res.json()
  return data.token
}

async function generateArticle(topic) {
  console.log(`\nGenerating article: "${topic}"...`)

  const prompt = `You are a senior logistics and trade analyst for Alpha Empire Logistics, a South African company operating cross-border logistics and industrial solutions across Southern and Central Africa (SA-DRC corridor focus).

Write a comprehensive, professional industry article about: "${topic}"

The article must follow this exact structure:
1. **Executive Summary** (2-3 paragraphs)
2. **Operational Impact** (2-3 paragraphs)
3. **Supply Chain Analysis** (2-3 paragraphs)
4. **Cross-Border Implications** (2-3 paragraphs)
5. **Regional Trade Impact** (2-3 paragraphs)
6. **Infrastructure Analysis** (2-3 paragraphs)
7. **Alpha Empire Logistics Perspective** (2 paragraphs — how this affects our clients and operations)
8. **Key Takeaways** (5-7 bullet points)

Also provide:
- SEO title (under 70 chars, compelling)
- SEO description (under 160 chars)
- SEO keywords (5-8 comma-separated)
- Slug (URL-safe, descriptive)
- Excerpt (2-3 sentences, engaging)
- Estimated reading time in minutes
- Category (choose one: Cross-Border Logistics, Mining Logistics, African Trade, Customs & Freight, Fleet Operations, Infrastructure, Supply Chain, Procurement, Industry Analysis)

Respond in JSON format:
{
  "title": "...",
  "slug": "...",
  "excerpt": "...",
  "content": "...",
  "category": "...",
  "reading_time": 7,
  "seo_title": "...",
  "seo_description": "...",
  "seo_keywords": "...",
  "language": "en"
}`

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content[0].text

  // Extract JSON
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('No JSON found in Claude response')
  }

  const article = JSON.parse(jsonMatch[0])
  return article
}

async function submitDraft(token, article) {
  const res = await fetch(`${API_BASE}/api/insights/draft`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...article,
      author: 'Alpha Empire Logistics Research Team',
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Submit failed: ${err.error || res.statusText}`)
  }

  return res.json()
}

async function main() {
  // Get topics from CLI args or use defaults
  const topics = process.argv.slice(2).length > 0
    ? process.argv.slice(2)
    : DEFAULT_TOPICS.slice(0, 3)  // Default: generate 3 articles

  console.log(`Alpha Empire Logistics — Weekly Insights Generator`)
  console.log(`Generating ${topics.length} article(s)...`)
  console.log(`API: ${API_BASE}`)

  let token
  try {
    token = await login()
    console.log('✓ Authenticated')
  } catch (err) {
    console.error('Authentication failed:', err.message)
    process.exit(1)
  }

  const results = []

  for (const topic of topics) {
    try {
      const article = await generateArticle(topic)

      // Ensure unique slug with timestamp
      article.slug = `${article.slug || slugify(article.title)}-${Date.now()}`

      const draft = await submitDraft(token, article)
      results.push({ topic, title: article.title, id: draft.id, slug: draft.slug, status: 'pending_review' })
      console.log(`✓ Submitted: ${article.title}`)
    } catch (err) {
      console.error(`✗ Failed for topic "${topic}":`, err.message)
      results.push({ topic, error: err.message })
    }
  }

  console.log(`\n${'─'.repeat(60)}`)
  console.log(`SUMMARY: ${results.filter(r => !r.error).length}/${results.length} articles generated`)
  console.log(`\nAll articles require admin approval before publishing.`)
  console.log(`Review at: ${API_BASE.replace(':3001', ':5173')}/admin/review`)
  console.log(`\nArticles:`)
  results.forEach(r => {
    if (r.error) {
      console.log(`  ✗ [${r.topic.slice(0, 40)}...] — ${r.error}`)
    } else {
      console.log(`  ✓ ${r.title}`)
      console.log(`    Status: ${r.status} | Admin review required`)
    }
  })
}

main().catch(err => {
  console.error('Fatal error:', err.message)
  process.exit(1)
})
