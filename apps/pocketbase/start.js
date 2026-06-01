/**
 * PocketBase start script.
 * Downloads PocketBase binary if not present and starts it.
 */
import { execSync, spawn } from 'child_process'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { platform, arch } from 'os'
import { createWriteStream } from 'fs'
import { get } from 'https'
import { createGunzip } from 'zlib'

const VERSION = '0.22.22'
const BASE_DIR = new URL('.', import.meta.url).pathname
const BIN_DIR = join(BASE_DIR, 'bin')
const BIN_PATH = join(BIN_DIR, process.platform === 'win32' ? 'pocketbase.exe' : 'pocketbase')
const DATA_DIR = join(BASE_DIR, 'data')

function getPbUrl() {
  const os = process.platform
  const cpu = arch()
  let osName, archName

  if (os === 'linux') osName = 'linux'
  else if (os === 'darwin') osName = 'darwin'
  else if (os === 'win32') osName = 'windows'
  else throw new Error(`Unsupported OS: ${os}`)

  if (cpu === 'x64') archName = 'amd64'
  else if (cpu === 'arm64') archName = 'arm64'
  else if (cpu === 'arm') archName = 'armv7'
  else throw new Error(`Unsupported arch: ${cpu}`)

  const ext = os === 'win32' ? 'zip' : 'zip'
  return `https://github.com/pocketbase/pocketbase/releases/download/v${VERSION}/pocketbase_${VERSION}_${osName}_${archName}.zip`
}

async function downloadPocketBase() {
  if (!existsSync(BIN_DIR)) mkdirSync(BIN_DIR, { recursive: true })
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })

  if (existsSync(BIN_PATH)) {
    console.log('PocketBase binary found.')
    return
  }

  console.log(`Downloading PocketBase v${VERSION}...`)
  const url = getPbUrl()
  const zipPath = join(BIN_DIR, 'pocketbase.zip')

  await new Promise((resolve, reject) => {
    const file = createWriteStream(zipPath)
    get(url, res => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        get(res.headers.location, res2 => res2.pipe(file))
      } else {
        res.pipe(file)
      }
      file.on('finish', () => { file.close(); resolve() })
    }).on('error', reject)
  })

  // Unzip
  execSync(`cd "${BIN_DIR}" && unzip -o pocketbase.zip pocketbase${process.platform === 'win32' ? '.exe' : ''} 2>/dev/null || true`)
  execSync(`chmod +x "${BIN_PATH}"`)
  console.log('PocketBase downloaded and ready.')
}

async function main() {
  try {
    await downloadPocketBase()
  } catch (err) {
    console.warn('Could not download PocketBase:', err.message)
    console.warn('Please download PocketBase manually from https://pocketbase.io/docs/')
    if (!existsSync(BIN_PATH)) process.exit(1)
  }

  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })

  const port = process.env.PB_PORT || 8090
  console.log(`Starting PocketBase on port ${port}...`)

  const pb = spawn(BIN_PATH, ['serve', '--http', `0.0.0.0:${port}`, '--dir', DATA_DIR], {
    stdio: 'inherit',
  })

  pb.on('error', err => {
    console.error('Failed to start PocketBase:', err.message)
    process.exit(1)
  })

  pb.on('exit', code => {
    console.log(`PocketBase exited with code ${code}`)
    process.exit(code || 0)
  })

  process.on('SIGINT', () => { pb.kill('SIGINT'); process.exit(0) })
  process.on('SIGTERM', () => { pb.kill('SIGTERM'); process.exit(0) })
}

main()
