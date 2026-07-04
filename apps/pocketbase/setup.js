/**
 * PocketBase schema setup script.
 * Creates collections via Admin API on first run.
 * Run: node apps/pocketbase/setup.js
 */
import PocketBase from 'pocketbase'
import 'dotenv/config'

const PB_URL = process.env.POCKETBASE_URL || 'http://localhost:8090'
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Set PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD env vars')
  process.exit(1)
}

const pb = new PocketBase(PB_URL)

const COLLECTIONS = [
  {
    name: 'articles',
    type: 'base',
    listRule: 'status = "published"',
    viewRule: 'status = "published"',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id != ""',
    deleteRule: '@request.auth.id != ""',
    schema: [
      { name: 'title', type: 'text', required: true, options: { min: 1, max: 500 } },
      { name: 'slug', type: 'text', required: true, options: { min: 1, max: 200 } },
      { name: 'excerpt', type: 'text', options: { max: 600 } },
      { name: 'content', type: 'editor', required: true },
      { name: 'featured_image', type: 'file', options: { maxSelect: 1, mimeTypes: ['image/jpeg', 'image/png', 'image/webp'] } },
      { name: 'category', type: 'text', options: { max: 100 } },
      { name: 'author', type: 'text', options: { max: 200 } },
      { name: 'reading_time', type: 'number', options: { min: 1 } },
      { name: 'view_count', type: 'number', options: { min: 0 } },
      { name: 'language', type: 'select', required: true, options: { maxSelect: 1, values: ['en', 'fr', 'zh', 'pt'] } },
      { name: 'status', type: 'select', required: true, options: { maxSelect: 1, values: ['draft', 'pending_review', 'approved', 'published', 'rejected'] } },
      { name: 'source', type: 'select', options: { maxSelect: 1, values: ['human', 'cowork'] } },
      { name: 'seo_title', type: 'text', options: { max: 200 } },
      { name: 'seo_description', type: 'text', options: { max: 500 } },
      { name: 'seo_keywords', type: 'text', options: { max: 500 } },
      { name: 'published_at', type: 'date' },
    ],
    indexes: ['CREATE UNIQUE INDEX idx_articles_slug ON articles (slug)'],
  },
  {
    name: 'categories',
    type: 'base',
    listRule: '',
    viewRule: '',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id != ""',
    deleteRule: '@request.auth.id != ""',
    schema: [
      { name: 'name', type: 'text', required: true, options: { min: 1, max: 100 } },
      { name: 'slug', type: 'text', required: true, options: { min: 1, max: 100 } },
    ],
    indexes: ['CREATE UNIQUE INDEX idx_categories_slug ON categories (slug)'],
  },
  {
    name: 'leads',
    type: 'base',
    listRule: '@request.auth.id != ""',
    viewRule: '@request.auth.id != ""',
    createRule: '',  // public can create
    updateRule: '@request.auth.id != ""',
    deleteRule: '@request.auth.id != ""',
    schema: [
      { name: 'name', type: 'text', required: true, options: { min: 1, max: 200 } },
      { name: 'email', type: 'email', required: true },
      { name: 'phone', type: 'text', options: { max: 50 } },
      { name: 'message', type: 'text', required: true, options: { min: 1, max: 2000 } },
      { name: 'type', type: 'select', options: { maxSelect: 1, values: ['quote', 'freight', 'partner', 'general'] } },
      { name: 'source_page', type: 'text', options: { max: 200 } },
    ],
  },
  {
    name: 'analytics_events',
    type: 'base',
    listRule: '@request.auth.id != ""',
    viewRule: '@request.auth.id != ""',
    createRule: '',  // public can create
    updateRule: '@request.auth.id != ""',
    deleteRule: '@request.auth.id != ""',
    schema: [
      { name: 'article_id', type: 'text', options: { max: 50 } },
      { name: 'type', type: 'select', required: true, options: { maxSelect: 1, values: ['view', 'cta_click', 'conversion'] } },
    ],
  },
]

async function setupCollections() {
  console.log('Authenticating with PocketBase admin...')
  await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD)
  console.log('Authenticated!')

  for (const col of COLLECTIONS) {
    try {
      // Check if collection exists
      const existing = await pb.collections.getOne(col.name).catch(() => null)

      if (existing) {
        console.log(`Collection "${col.name}" already exists — skipping`)
        continue
      }

      console.log(`Creating collection: ${col.name}`)
      await pb.collections.create({
        name: col.name,
        type: col.type,
        listRule: col.listRule,
        viewRule: col.viewRule,
        createRule: col.createRule,
        updateRule: col.updateRule,
        deleteRule: col.deleteRule,
        schema: col.schema,
        indexes: col.indexes || [],
      })
      console.log(`✓ Created: ${col.name}`)
    } catch (err) {
      console.error(`✗ Error creating ${col.name}:`, err.message)
    }
  }

  console.log('\nPocketBase setup complete!')
}

setupCollections().catch(err => {
  console.error('Setup failed:', err.message)
  process.exit(1)
})
