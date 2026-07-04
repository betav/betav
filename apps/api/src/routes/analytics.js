import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import PocketBase from 'pocketbase'

const router = Router()
const POCKETBASE_URL = process.env.POCKETBASE_URL || 'http://localhost:8090'

const analyticsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: 'Rate limit exceeded' },
})

router.post('/', analyticsLimiter, async (req, res, next) => {
  try {
    const { article_id, type } = req.body
    if (!type || !['view', 'cta_click', 'conversion'].includes(type)) {
      return res.status(400).json({ error: 'Invalid event type' })
    }

    const pb = new PocketBase(POCKETBASE_URL)
    await pb.collection('analytics_events').create({
      article_id: article_id || '',
      type,
    })

    res.status(201).json({ ok: true })
  } catch (err) {
    // Analytics failures should not surface to users
    res.status(201).json({ ok: true })
  }
})

export default router
