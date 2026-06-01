import PocketBase from 'pocketbase'

const POCKETBASE_URL = process.env.POCKETBASE_URL || 'http://localhost:8090'

export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  const token = authHeader.slice(7)

  try {
    const pb = new PocketBase(POCKETBASE_URL)
    pb.authStore.save(token, null)

    // Verify token is valid by calling authRefresh
    await pb.collection('users').authRefresh()
    req.pb = pb
    req.token = token
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

// Auth for cowork service agent — accepts COWORK token OR admin token
export async function requireServiceAuth(req, res, next) {
  return requireAuth(req, res, next)
}
