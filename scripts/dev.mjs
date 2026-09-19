import { spawn } from 'node:child_process'
import open from 'open'

const PORT = process.env.PORT || 3000
const URL = `http://localhost:${PORT}`

const next = spawn('npx', ['next', 'dev'], { stdio: 'inherit', shell: true })

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(URL)
      if (res.ok || res.status < 500) return true
    } catch {
      // server not ready yet
    }
    await new Promise(r => setTimeout(r, 500))
  }
  return false
}

waitForServer().then(ready => {
  if (ready) open(URL)
})

next.on('exit', code => process.exit(code ?? 0))
