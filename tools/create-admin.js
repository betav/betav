#!/usr/bin/env node
/**
 * Creates an admin user in PocketBase.
 * Idempotent — safe to run multiple times.
 *
 * Usage:
 *   ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=secret POCKETBASE_URL=http://localhost:8090 node tools/create-admin.js
 */
import PocketBase from 'pocketbase'

const POCKETBASE_URL = process.env.POCKETBASE_URL || 'http://localhost:8090'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('ERROR: ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required')
  console.error('Usage: ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=secret node tools/create-admin.js')
  process.exit(1)
}

if (ADMIN_PASSWORD.length < 10) {
  console.error('ERROR: ADMIN_PASSWORD must be at least 10 characters')
  process.exit(1)
}

async function createAdmin() {
  const pb = new PocketBase(POCKETBASE_URL)
  console.log(`Connecting to PocketBase at ${POCKETBASE_URL}...`)

  // First, try to auth with existing credentials (idempotency check)
  try {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD)
    console.log(`✓ Admin user already exists: ${ADMIN_EMAIL}`)
    return
  } catch (err) {
    if (err.status !== 400 && err.status !== 401) {
      throw err
    }
  }

  // Try to create the admin via the setup endpoint (requires no existing admin)
  try {
    await pb.admins.create({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      passwordConfirm: ADMIN_PASSWORD,
    })
    console.log(`✓ Admin user created: ${ADMIN_EMAIL}`)
  } catch (err) {
    // If 403 or similar, PocketBase may require existing admin auth to create new admins
    if (err.status === 400 || err.status === 403) {
      console.error('Could not create admin. PocketBase may require you to create the first admin via the web UI at:')
      console.error(`  ${POCKETBASE_URL}/_/`)
      process.exit(1)
    }
    throw err
  }
}

createAdmin().catch(err => {
  console.error('Failed:', err.message)
  process.exit(1)
})
