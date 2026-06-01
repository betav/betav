import { Router } from 'express'
import multer from 'multer'
import PocketBase from 'pocketbase'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })
const POCKETBASE_URL = process.env.POCKETBASE_URL || 'http://localhost:8090'

function getPb(token) {
  const pb = new PocketBase(POCKETBASE_URL)
  if (token) pb.authStore.save(token, null)
  return pb
}

// GET /api/articles — public, published only
router.get('/', async (req, res, next) => {
  try {
    const { lang, category, search, page = 1, limit = 12 } = req.query
    const pb = getPb()

    const filters = ['status = "published"']
    if (lang) filters.push(`language = "${lang}"`)
    if (category) filters.push(`category = "${category}"`)
    if (search) filters.push(`(title ~ "${search}" || excerpt ~ "${search}" || content ~ "${search}")`)

    const result = await pb.collection('articles').getList(Number(page), Number(limit), {
      filter: filters.join(' && '),
      sort: '-published_at',
      fields: 'id,slug,title,excerpt,category,author,reading_time,view_count,language,published_at,created,featured_image',
    })

    res.json(result)
  } catch (err) {
    next(err)
  }
})

// GET /api/articles/admin/list — admin auth, ALL articles
router.get('/admin/list', requireAuth, async (req, res, next) => {
  try {
    const { status, page = 1, limit = 50 } = req.query
    const pb = getPb(req.token)

    const filters = []
    if (status) filters.push(`status = "${status}"`)

    const result = await pb.collection('articles').getList(Number(page), Number(limit), {
      filter: filters.join(' && ') || undefined,
      sort: '-created',
    })

    res.json(result)
  } catch (err) {
    next(err)
  }
})

// GET /api/articles/:slug — public, published only, increments view_count
router.get('/:slug', async (req, res, next) => {
  try {
    const pb = getPb()
    const records = await pb.collection('articles').getList(1, 1, {
      filter: `slug = "${req.params.slug}" && status = "published"`,
    })

    if (records.items.length === 0) {
      return res.status(404).json({ error: 'Article not found' })
    }

    const article = records.items[0]

    // Increment view_count async (don't block response)
    const adminPb = getPb()
    adminPb.collection('articles')
      .update(article.id, { view_count: (article.view_count || 0) + 1 })
      .catch(() => {})

    res.json(article)
  } catch (err) {
    next(err)
  }
})

// POST /api/articles — admin auth required
router.post('/', requireAuth, upload.single('featured_image'), async (req, res, next) => {
  try {
    const pb = getPb(req.token)
    const {
      title, slug, excerpt, content, category, author, reading_time,
      language, status, seo_title, seo_description, seo_keywords,
    } = req.body

    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'title, slug, and content are required' })
    }

    const data = new FormData()
    data.append('title', title)
    data.append('slug', slug)
    data.append('excerpt', excerpt || '')
    data.append('content', content)
    data.append('category', category || '')
    data.append('author', author || '')
    data.append('reading_time', reading_time || 5)
    data.append('language', language || 'en')
    data.append('status', status || 'draft')
    data.append('source', 'human')
    data.append('seo_title', seo_title || '')
    data.append('seo_description', seo_description || '')
    data.append('seo_keywords', seo_keywords || '')
    data.append('view_count', 0)

    if (req.file) {
      const blob = new Blob([req.file.buffer], { type: req.file.mimetype })
      data.append('featured_image', blob, req.file.originalname)
    }

    const record = await pb.collection('articles').create(data)
    res.status(201).json(record)
  } catch (err) {
    next(err)
  }
})

// PATCH /api/articles/:id — admin auth
router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const pb = getPb(req.token)
    const record = await pb.collection('articles').update(req.params.id, req.body)
    res.json(record)
  } catch (err) {
    next(err)
  }
})

// POST /api/articles/:id/approve — admin auth
router.post('/:id/approve', requireAuth, async (req, res, next) => {
  try {
    const pb = getPb(req.token)
    const record = await pb.collection('articles').update(req.params.id, {
      status: 'published',
      published_at: new Date().toISOString(),
    })
    res.json(record)
  } catch (err) {
    next(err)
  }
})

// POST /api/articles/:id/reject — admin auth
router.post('/:id/reject', requireAuth, async (req, res, next) => {
  try {
    const pb = getPb(req.token)
    const record = await pb.collection('articles').update(req.params.id, {
      status: 'rejected',
    })
    res.json(record)
  } catch (err) {
    next(err)
  }
})

export default router
