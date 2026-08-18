import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = join(root, 'interview')
const enDir = join(srcDir, 'en')
const excludeNames = new Set(['interview.md'])
const reportOnly = process.argv.includes('--report')

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      if (full === enDir)
        continue
      walk(full, files)
      continue
    }
    if (!name.endsWith('.md') || excludeNames.has(name))
      continue
    files.push(full)
  }
  return files
}

function extractTitle(content, fallback) {
  const fm = content.match(/^---\n([\s\S]*?)\n---/)
  const titleInFm = fm?.[1].match(/^title:\s*(.+)$/m)
  if (titleInFm)
    return titleInFm[1].trim().replace(/^["']|["']$/g, '')
  const heading = content.match(/^#{1,6}\s+(.+)$/m)
  return heading ? heading[1].trim() : fallback
}

function toZhLink(rel) {
  const withoutExt = rel.replace(/\.md$/, '')
  if (withoutExt === 'index')
    return '/'
  if (withoutExt.endsWith('/index'))
    return `/${withoutExt.slice(0, -'/index'.length)}/`
  return `/${withoutExt}`
}

function isStub(content) {
  return /^---[\s\S]*?i18nStub:\s*true[\s\S]*?---/m.test(content)
}

function stubContent(title, zhLink) {
  return `---
i18nStub: true
---
# ${title}

::: warning Not translated yet
This page has not been translated into English yet.
[Read the Chinese version](${zhLink})
:::
`
}

const zhFiles = walk(srcDir)
const stats = {
  total: zhFiles.length,
  translated: 0,
  stubs: 0,
  created: 0,
  pending: [],
}

for (const zhFile of zhFiles) {
  const rel = relative(srcDir, zhFile)
  const enFile = join(enDir, rel)
  const zhContent = readFileSync(zhFile, 'utf8')
  const title = extractTitle(zhContent, rel.replace(/\.md$/, ''))
  const zhLink = toZhLink(rel)

  if (!existsSync(enFile)) {
    if (!reportOnly) {
      mkdirSync(dirname(enFile), { recursive: true })
      writeFileSync(enFile, stubContent(title, zhLink))
      stats.created++
    }
    stats.stubs++
    stats.pending.push(rel)
    continue
  }

  const enContent = readFileSync(enFile, 'utf8')
  if (isStub(enContent)) {
    if (!reportOnly) {
      writeFileSync(enFile, stubContent(title, zhLink))
    }
    stats.stubs++
    stats.pending.push(rel)
  }
  else {
    stats.translated++
  }
}

const done = stats.translated
const percent = stats.total ? ((done / stats.total) * 100).toFixed(1) : '0.0'
console.log(`translated ${done} / ${stats.total} (${percent}%)`)
if (stats.created)
  console.log(`created ${stats.created} stub(s)`)

if (reportOnly && stats.pending.length) {
  const groups = new Map()
  for (const rel of stats.pending) {
    const dir = rel.includes('/') ? rel.split('/')[0] : '(root)'
    if (!groups.has(dir))
      groups.set(dir, [])
    groups.get(dir).push(rel)
  }
  console.log('\npending by directory:')
  for (const [dir, files] of [...groups.entries()].sort((a, b) => b[1].length - a[1].length))
    console.log(`  ${dir}: ${files.length}`)
}
