import { Router } from 'express'
import PocketBase from 'pocketbase'

const router = Router()
const POCKETBASE_URL = process.env.POCKETBASE_URL || 'http://localhost:8090'

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }

    const pb = new PocketBase(POCKETBASE_URL)
    const authData = await pb.collection('users').authWithPassword(email, password)

    res.json({
      token: authData.token,
      user: {
        id: authData.record.id,
        email: authData.record.email,
        name: authData.record.name,
      },
    })
  } catch (err) {
    if (err.status === 400 || err.status === 401) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    next(err)
  }
})

export default router
