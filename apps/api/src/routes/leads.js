import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import PocketBase from 'pocketbase'

const router = Router()
const POCKETBASE_URL = process.env.POCKETBASE_URL || 'http://localhost:8090'

const leadsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { error: 'Too many submissions, please try again later' },
})

router.post('/', leadsLimiter, async (req, res, next) => {
  try {
    const { name, email, phone, message, type, source_page } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'name, email, and message are required' })
    }

    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' })
    }

    const pb = new PocketBase(POCKETBASE_URL)

    const record = await pb.collection('leads').create({
      name,
      email,
      phone: phone || '',
      message,
      type: type || 'general',
      source_page: source_page || '',
    })

    res.status(201).json({ id: record.id, message: 'Inquiry received' })
  } catch (err) {
    next(err)
  }
})

export default router
