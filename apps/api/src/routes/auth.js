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

    // Try PocketBase superadmin auth first, fall back to regular users collection
    let token, record
    try {
      const authData = await pb.admins.authWithPassword(email, password)
      token = authData.token
      record = { id: authData.admin?.id, email: authData.admin?.email, name: 'Admin', role: 'admin' }
    } catch {
      const authData = await pb.collection('users').authWithPassword(email, password)
      token = authData.token
      record = { id: authData.record.id, email: authData.record.email, name: authData.record.name, role: authData.record.role }
    }

    res.json({ token, user: record })
  } catch (err) {
    if (err.status === 400 || err.status === 401) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    next(err)
  }
})

export default router
