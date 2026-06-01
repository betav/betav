import { Router } from 'express'
import PocketBase from 'pocketbase'
import { requireServiceAuth } from '../middleware/auth.js'

const router = Router()
const POCKETBASE_URL = process.env.POCKETBASE_URL || 'http://localhost:8090'

// POST /api/insights/draft — service/admin auth only
// This is the ONLY way the AI agent adds content
router.post('/draft', requireServiceAuth, async (req, res, next) => {
  try {
    const pb = new PocketBase(POCKETBASE_URL)
    pb.authStore.save(req.token, null)

    const {
      title, slug, excerpt, content, category, author,
      reading_time, language, seo_title, seo_description, seo_keywords,
    } = req.body

    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'title, slug, and content are required' })
    }

    const record = await pb.collection('articles').create({
      title,
      slug,
      excerpt: excerpt || '',
      content,
      category: category || '',
      author: author || 'Alpha Empire Logistics',
      reading_time: reading_time || 5,
      language: language || 'en',
      status: 'pending_review',   // ALWAYS pending_review — never auto-published
      source: 'cowork',           // ALWAYS cowork for AI-generated content
      seo_title: seo_title || title,
      seo_description: seo_description || excerpt || '',
      seo_keywords: seo_keywords || '',
      view_count: 0,
    })

    res.status(201).json({
      id: record.id,
      slug: record.slug,
      status: record.status,
      source: record.source,
      message: 'Draft created. Pending admin review before publishing.',
    })
  } catch (err) {
    if (err.status === 400) {
      return res.status(400).json({ error: err.message, data: err.data })
    }
    next(err)
  }
})

export default router
