import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const docs = {
  entry: 'CLAUDE.md',
  charter: 'docs/PROJECT_CHARTER.md',
  decisions: 'docs/DECISIONS.md',
  status: 'docs/PROJECT_STATUS.md',
  timelineProtocol: 'docs/timeline/README.md',
}

const requiredStatusHeadings = [
  '## Current State',
  '## Source Of Truth',
  '## Proven Evidence',
  '## Open Questions',
  '## Scope',
  '## Next Steps',
  '## Acceptance Criteria',
  '## Verification Commands',
  '## Known Pitfalls',
  '## Startup Prompt',
]

const requiredTimelineHeadings = [
  '## Event',
  '## Git',
  '## Goal',
  '## Scope',
  '## Decisions',
  '## Verification',
  '## Risks',
  '## Handoff',
]

function git(args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim()
}

function read(path) {
  return readFileSync(join(root, path), 'utf8')
}

function timelineEntries() {
  const directory = join(root, 'docs/timeline')
  if (!existsSync(directory)) return []

  return readdirSync(directory)
    .filter((name) => /^\d{4}-\d{2}-\d{2}-\d{4}-.+\.md$/.test(name))
    .sort()
}

function field(markdown, label) {
  const match = markdown.match(new RegExp(`^- ${label}:\\s*(.+)$`, 'm'))
  return match?.[1]?.replaceAll('`', '') ?? '未记录'
}

function sectionFirstItem(markdown, heading) {
  const start = markdown.indexOf(`${heading}\n`)
  if (start === -1) return '未记录'

  const rest = markdown.slice(start + heading.length + 1)
  const end = rest.search(/^## /m)
  const section = end === -1 ? rest : rest.slice(0, end)
  const numbered = section.match(/^\d+\.\s+(.+)$/m)
  return numbered?.[1]?.trim() ?? '未记录'
}

function check() {
  const errors = []

  for (const path of Object.values(docs)) {
    if (!existsSync(join(root, path))) errors.push(`缺少必需文件：${path}`)
  }

  if (errors.length === 0) {
    const status = read(docs.status)
    let previousIndex = -1

    for (const heading of requiredStatusHeadings) {
      const index = status.indexOf(heading)
      if (index === -1) errors.push(`PROJECT_STATUS 缺少标题：${heading}`)
      if (index !== -1 && index < previousIndex) {
        errors.push(`PROJECT_STATUS 标题顺序错误：${heading}`)
      }
      if (index !== -1) previousIndex = index
    }

    const finalHeading = [...status.matchAll(/^## .+$/gm)].at(-1)?.[0]
    if (finalHeading !== '## Startup Prompt') {
      errors.push('PROJECT_STATUS 的最后一节必须是 Startup Prompt')
    }

    const documentedBranch = field(status, 'branch')
    const actualBranch = git(['rev-parse', '--abbrev-ref', 'HEAD'])
    if (documentedBranch !== actualBranch) {
      errors.push(`状态板分支 ${documentedBranch} 与 Git 分支 ${actualBranch} 不一致`)
    }

    for (const label of ['active owner', 'current phase']) {
      if (field(status, label) === '未记录') errors.push(`PROJECT_STATUS 缺少字段：${label}`)
    }
  }

  const entries = timelineEntries()
  if (entries.length === 0) errors.push('docs/timeline 中没有时间线事件')

  for (const name of entries) {
    const markdown = read(`docs/timeline/${name}`)
    for (const heading of requiredTimelineHeadings) {
      if (!markdown.includes(heading)) errors.push(`${name} 缺少标题：${heading}`)
    }
    for (const label of ['actor', 'base commit', 'next owner', 'permission', 'first action']) {
      if (field(markdown, label) === '未记录') errors.push(`${name} 缺少字段：${label}`)
    }
  }

  const scannedPaths = [...Object.values(docs), ...entries.map((name) => `docs/timeline/${name}`)]
  const forbidden = /\b(TBD|TO\s*DO|FILL\s+ME|PLACEHOLDER)\b|<placeholder>/i
  for (const path of scannedPaths) {
    if (existsSync(join(root, path)) && forbidden.test(read(path))) {
      errors.push(`${path} 含未解决占位符`)
    }
  }

  if (errors.length > 0) {
    console.error('Context protocol check failed:')
    for (const error of errors) console.error(`- ${error}`)
    process.exitCode = 1
    return
  }

  console.log(`Context protocol check passed. ${entries.length} timeline event(s) verified.`)
}

function printContext() {
  const status = read(docs.status)
  const entries = timelineEntries()
  const latest = entries.slice(-3).reverse()
  const dirty = git(['status', '--short']) || 'clean'
  const commits = git(['log', '-n', '5', '--oneline'])

  console.log('# Personal Portal Context')
  console.log(`cwd: ${root}`)
  console.log(`branch: ${git(['rev-parse', '--abbrev-ref', 'HEAD'])}`)
  console.log(`active owner: ${field(status, 'active owner')}`)
  console.log(`current phase: ${field(status, 'current phase')}`)
  console.log(`first action: ${sectionFirstItem(status, '## Next Steps')}`)
  console.log('\n## Worktree')
  console.log(dirty)
  console.log('\n## Recent commits')
  console.log(commits)
  console.log('\n## Recent timeline')
  if (latest.length === 0) console.log('None')
  for (const name of latest) console.log(`- ${relative(root, join(root, 'docs/timeline', name))}`)
  console.log('\n## Read next')
  for (const path of Object.values(docs)) console.log(`- ${path}`)
}

if (process.argv.includes('--check')) {
  check()
} else {
  printContext()
}
