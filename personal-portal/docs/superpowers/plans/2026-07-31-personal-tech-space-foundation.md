# Personal Tech Space Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有科幻模板改造成可公开访问的 Gallery & Paper 个人技术网站，交付首页、藏宝阁、三件真实藏品、可打印简历舱和文件驱动内容系统。

**Architecture:** 保留 React、TypeScript、Vite、React Router 和 Netlify SPA 部署。藏品元数据使用与正文同目录的 `meta.json`，正文使用 MDX；Vite 构建插件负责元数据和目录一致性校验，浏览器端内容加载器负责排序、筛选和语言回退。页面使用同一 `SiteShell`，由路由和藏品类型决定暗色 Gallery 或暖色 Paper 场景。

**Tech Stack:** React 19.2、TypeScript 5.9、Vite 7.3、React Router 7.13、Tailwind CSS 4.2、i18next 25.8、MDX

## Global Constraints

- 只允许创建本地 commit；禁止主动运行 `git push`、创建 PR 或触发远程部署。
- 当前工作分支是 `dev_1`；不创建新分支，不改写历史。
- 保留未提交的 `README.md` 修改，并在文档清理任务中显式纳入；不处理仓库根目录的 `../.DS_Store`。
- 首期不引入后端、数据库、CMS、登录、评论、完整时间线或全文搜索。
- 设计规格要求首期发布 3–5 件真实藏品；本计划先交付 `personal-portal`、`particle-field`、`typewriter-effect` 三件，不虚构工作单位、商业项目或职业成果。
- 公开联系入口只使用 `https://github.com/zhangcycoder`；Netlify 登录邮箱不得出现在生产页面或提交内容中。
- 中文是必填内容；英文缺失时回退中文。
- Gallery 页面使用墨黑、暖白和单一冷蓝；Paper 页面使用暖灰、深色正文和同一冷蓝。
- 不恢复满屏粒子、扫描线、霓虹描边或自定义光标；旧粒子和打字机效果只作为藏宝阁 Demo。
- React/Tailwind 代码不得使用 `text-[...]`、`gap-[...]` 等任意值类；精确视觉值写入语义 CSS 类。
- 跨模块公共组件、可复用函数和自定义 Hook 补充符合仓库约定的中文 JSDoc。
- 默认不新增自动化测试文件。实现完成后先询问用户，再运行 build、lint、现有测试或手动浏览器检查。
- Node.js 版本要求沿用 Vite：`^20.19.0 || >=22.12.0`。

## Locked File Structure

```text
personal-portal/
  public/
    covers/
      particle-field.svg
      personal-portal.svg
      typewriter-effect.svg
    favicon.svg
    _redirects
  src/
    components/
      layout/
        SiteFooter.tsx
        SiteHeader.tsx
        SiteShell.tsx
      vault/
        DemoBoundary.tsx
        DemoStage.tsx
        TreasureCard.tsx
        VaultFilter.tsx
    content/
      resume/
        profile.ts
      vault/
        particle-field/
          index.mdx
          meta.json
        personal-portal/
          index.mdx
          meta.json
        typewriter-effect/
          index.mdx
          meta.json
      contentLoader.ts
      schema.ts
    demos/
      particle-field/
        index.tsx
      typewriter-effect/
        index.tsx
      registry.ts
    hooks/
      usePageMeta.ts
    i18n/
      locales/
        en-US.json
        zh-CN.json
      index.ts
    pages/
      HomePage.tsx
      LegacyProjectRedirect.tsx
      NotFoundPage.tsx
      ResumePage.tsx
      TreasureDetailPage.tsx
      VaultPage.tsx
    styles/
      content.css
      global.css
      site.css
      tokens.css
    types/
      index.ts
      mdx.d.ts
    App.tsx
    main.tsx
  docs/
    superpowers/
      plans/
      specs/
  vite.config.ts
  index.html
  package.json
  package-lock.json
  README.md
```

---

### Task 1: Typed MDX Content Foundation

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `vite.config.ts`
- Modify: `tsconfig.app.json`
- Create: `src/content/schema.ts`
- Create: `src/types/mdx.d.ts`

**Interfaces:**
- Produces: `TreasureType`, `LocalizedText`, `TreasureMeta`, `validateTreasureMeta()`, `resolveLocalizedText()`.
- Consumed by: content loader, Vite validation plugin, all vault pages.

- [ ] **Step 1: Install the single new MDX dependency**

Run:

```bash
npm install --save-dev @mdx-js/rollup
```

Expected file changes: `package.json` and `package-lock.json` add `@mdx-js/rollup`; no other package is intentionally added.

- [ ] **Step 2: Define the content schema and language fallback**

Create `src/content/schema.ts` with these public contracts:

```ts
export type SupportedLocale = 'zh-CN' | 'en-US'

export interface LocalizedText {
  'zh-CN': string
  'en-US'?: string
}

export type TreasureType = 'demo' | 'ui' | 'module' | 'note' | 'project'
export type TreasureStatus = 'draft' | 'published'

export interface TreasureMeta {
  slug: string
  title: LocalizedText
  summary: LocalizedText
  type: TreasureType
  tags: string[]
  createdAt: string
  updatedAt: string
  status: TreasureStatus
  featured: boolean
  cover: string
  demoKey?: string
  sourceUrl?: string
  externalUrl?: string
}

const TREASURE_TYPES: TreasureType[] = ['demo', 'ui', 'module', 'note', 'project']
const TREASURE_STATUSES: TreasureStatus[] = ['draft', 'published']
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasChineseText(value: unknown): value is LocalizedText {
  return isRecord(value) && typeof value['zh-CN'] === 'string' && value['zh-CN'].trim().length > 0
}

/**
 * @name 校验藏品元数据
 * @description 在构建期和运行期共享，发现字段缺失或格式错误时抛出带字段名的异常。
 * @param value 从 meta.json 读取的未知对象。
 */
export function validateTreasureMeta(value: unknown): asserts value is TreasureMeta {
  if (!isRecord(value)) throw new Error('meta must be an object')
  if (typeof value.slug !== 'string' || value.slug.trim().length === 0) throw new Error('slug is required')
  if (!hasChineseText(value.title)) throw new Error('title.zh-CN is required')
  if (!hasChineseText(value.summary)) throw new Error('summary.zh-CN is required')
  if (!TREASURE_TYPES.includes(value.type as TreasureType)) throw new Error('type is invalid')
  if (!Array.isArray(value.tags) || value.tags.some((tag) => typeof tag !== 'string')) throw new Error('tags must be string[]')
  if (typeof value.createdAt !== 'string' || !ISO_DATE_PATTERN.test(value.createdAt)) throw new Error('createdAt must use YYYY-MM-DD')
  if (typeof value.updatedAt !== 'string' || !ISO_DATE_PATTERN.test(value.updatedAt)) throw new Error('updatedAt must use YYYY-MM-DD')
  if (!TREASURE_STATUSES.includes(value.status as TreasureStatus)) throw new Error('status is invalid')
  if (typeof value.featured !== 'boolean') throw new Error('featured must be boolean')
  if (typeof value.cover !== 'string' || value.cover.trim().length === 0) throw new Error('cover is required')
}

/**
 * @name 读取本地化文本
 * @returns 当前语言存在时返回对应文本，否则返回中文。
 */
export function resolveLocalizedText(value: LocalizedText, locale: string): string {
  return locale === 'en-US' && value['en-US'] ? value['en-US'] : value['zh-CN']
}
```

- [ ] **Step 3: Add MDX module typing**

Create `src/types/mdx.d.ts`:

```ts
declare module '*.mdx' {
  import type { ComponentType } from 'react'

  const MDXContent: ComponentType
  export default MDXContent
}
```

Add `"resolveJsonModule": true` to `compilerOptions` in `tsconfig.app.json`.

- [ ] **Step 4: Configure MDX and build-time metadata validation**

Replace `vite.config.ts` with a configuration that:

1. Runs `mdx()` before the React plugin.
2. Extends the React include pattern to MDX.
3. Scans `src/content/vault/*/meta.json` during `buildStart`.
4. Calls `validateTreasureMeta`.
5. Rejects duplicate slugs, a directory/slug mismatch, or a missing sibling `index.mdx`.

Use this plugin shape:

```ts
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import mdx from '@mdx-js/rollup'
import { defineConfig, type Plugin } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { validateTreasureMeta } from './src/content/schema'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))

function validateVaultContent(): Plugin {
  return {
    name: 'validate-vault-content',
    buildStart() {
      const vaultRoot = resolve(projectRoot, 'src/content/vault')
      if (!existsSync(vaultRoot)) return

      const seenSlugs = new Set<string>()
      for (const entry of readdirSync(vaultRoot, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue

        const metaPath = resolve(vaultRoot, entry.name, 'meta.json')
        const bodyPath = resolve(vaultRoot, entry.name, 'index.mdx')
        if (!existsSync(metaPath) || !existsSync(bodyPath)) {
          this.error(`${entry.name}: meta.json and index.mdx are both required`)
        }

        try {
          const meta: unknown = JSON.parse(readFileSync(metaPath, 'utf8'))
          validateTreasureMeta(meta)
          if (meta.slug !== entry.name) this.error(`${entry.name}: slug must match directory name`)
          if (seenSlugs.has(meta.slug)) this.error(`${entry.name}: duplicate slug ${meta.slug}`)
          seenSlugs.add(meta.slug)
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error)
          this.error(`${entry.name}: ${message}`)
        }
      }
    },
  }
}

export default defineConfig({
  plugins: [
    validateVaultContent(),
    mdx(),
    react({ include: /\.(js|jsx|ts|tsx|md|mdx)$/ }),
    tailwindcss(),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
})
```

- [ ] **Step 5: Review the task diff without running project verification**

Confirm the diff contains only the six task files and that the new dependency is `@mdx-js/rollup`.

- [ ] **Step 6: Commit locally**

```bash
git add package.json package-lock.json vite.config.ts tsconfig.app.json src/content/schema.ts src/types/mdx.d.ts
git commit -m "feat(portal): add typed MDX content pipeline"
```

Do not push.

---

### Task 2: Vault Loader and Three Real Treasures

**Files:**
- Create: `src/content/contentLoader.ts`
- Create: `src/content/vault/personal-portal/meta.json`
- Create: `src/content/vault/personal-portal/index.mdx`
- Create: `src/content/vault/particle-field/meta.json`
- Create: `src/content/vault/particle-field/index.mdx`
- Create: `src/content/vault/typewriter-effect/meta.json`
- Create: `src/content/vault/typewriter-effect/index.mdx`
- Create: `public/covers/personal-portal.svg`
- Create: `public/covers/particle-field.svg`
- Create: `public/covers/typewriter-effect.svg`

**Interfaces:**
- Consumes: `TreasureMeta`, `validateTreasureMeta`.
- Produces: `TreasureRecord`, `getPublishedTreasures()`, `getFeaturedTreasures()`, `getTreasureBySlug()`, `getTreasureTypes()`.

- [ ] **Step 1: Build the eager content catalog**

Create `src/content/contentLoader.ts`:

```ts
import type { ComponentType } from 'react'
import {
  validateTreasureMeta,
  type TreasureMeta,
  type TreasureType,
} from './schema'

interface MDXModule {
  default: ComponentType
}

interface JsonModule {
  default: TreasureMeta
}

export interface TreasureRecord extends TreasureMeta {
  Body: ComponentType
}

const metaModules = import.meta.glob<JsonModule>('./vault/*/meta.json', { eager: true })
const bodyModules = import.meta.glob<MDXModule>('./vault/*/index.mdx', { eager: true })

function directoryFromMetaPath(path: string): string {
  return path.replace('./vault/', '').replace('/meta.json', '')
}

const catalog: TreasureRecord[] = Object.entries(metaModules).map(([metaPath, module]) => {
  const directory = directoryFromMetaPath(metaPath)
  const meta: unknown = module.default
  validateTreasureMeta(meta)

  const body = bodyModules[`./vault/${directory}/index.mdx`]
  if (!body) throw new Error(`${directory}: index.mdx is missing`)
  if (meta.slug !== directory) throw new Error(`${directory}: slug must match directory name`)

  return { ...meta, Body: body.default }
})

/**
 * @name 获取已发布藏品
 * @returns 按更新时间从新到旧排列的藏品。
 */
export function getPublishedTreasures(): TreasureRecord[] {
  return catalog
    .filter((item) => item.status === 'published')
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
}

/** @name 获取首页精选藏品 */
export function getFeaturedTreasures(limit = 3): TreasureRecord[] {
  return getPublishedTreasures().filter((item) => item.featured).slice(0, limit)
}

/**
 * @name 按地址获取藏品
 * @returns 未发布或不存在时返回 undefined。
 */
export function getTreasureBySlug(slug: string | undefined): TreasureRecord | undefined {
  if (!slug) return undefined
  return getPublishedTreasures().find((item) => item.slug === slug)
}

/** @name 获取当前存在的藏品类型 */
export function getTreasureTypes(): TreasureType[] {
  return [...new Set(getPublishedTreasures().map((item) => item.type))]
}
```

- [ ] **Step 2: Add the personal portal project**

Use this exact public metadata in `src/content/vault/personal-portal/meta.json`:

```json
{
  "slug": "personal-portal",
  "title": { "zh-CN": "个人技术空间", "en-US": "Personal Tech Space" },
  "summary": { "zh-CN": "一个用于沉淀技术实践、展示作品与承载职业信息的个人网站。", "en-US": "A personal site for technical notes, selected work, and professional context." },
  "type": "project",
  "tags": ["React", "TypeScript", "Vite", "Netlify"],
  "createdAt": "2026-03-12",
  "updatedAt": "2026-07-31",
  "status": "published",
  "featured": true,
  "cover": "/covers/personal-portal.svg",
  "sourceUrl": "https://github.com/zhangcycoder/zcy-corner",
  "externalUrl": "https://amazing-chebakia-758e0e.netlify.app/"
}
```

The MDX body must explain the site purpose, Gallery & Paper direction, current React/Vite stack, and GitHub-to-Netlify workflow without claiming unverified career outcomes.

Use this body:

```mdx
# 个人技术空间

这个网站用于持续整理技术实践、可复用模块、交互实验和职业信息。它不是一次性完成的作品集，而是一套可以跟随技术积累继续生长的内容系统。

## 设计方向

网站采用 Gallery & Paper 双场景设计：暗色画廊负责发现作品和运行实验，暖色阅读空间负责承载技术正文与简历内容。两种场景共享导航、栅格、冷蓝强调色和克制的动效规则。

## 技术实现

项目基于 React、TypeScript 与 Vite，使用 React Router 管理页面，使用 Markdown/MDX 管理藏品正文。内容和代码保存在同一个 Git 仓库中。

## 发布方式

代码维护在 GitHub，生产构建由 Netlify 托管。站点保留 SPA 深层路由回退配置，确保藏品详情可以直接访问。
```

- [ ] **Step 3: Add the particle field and typewriter artifacts**

Use `demoKey: "particle-field"` and `type: "demo"` for `particle-field`.
Use `demoKey: "typewriter-effect"` and `type: "module"` for `typewriter-effect`.
Both use `createdAt: "2026-03-12"`, `updatedAt: "2026-07-31"`, `status: "published"`, `featured: true`.

Use this exact particle metadata:

```json
{
  "slug": "particle-field",
  "title": { "zh-CN": "Canvas 粒子力场", "en-US": "Canvas Particle Field" },
  "summary": { "zh-CN": "一个支持指针排斥、边界反弹和降级显示的 Canvas 粒子实验。", "en-US": "A Canvas particle experiment with pointer repulsion, boundary bounce, and graceful fallback." },
  "type": "demo",
  "tags": ["Canvas", "React", "Animation"],
  "createdAt": "2026-03-12",
  "updatedAt": "2026-07-31",
  "status": "published",
  "featured": true,
  "cover": "/covers/particle-field.svg",
  "demoKey": "particle-field",
  "sourceUrl": "https://github.com/zhangcycoder/zcy-corner/blob/dev_1/personal-portal/src/components/ParticleSystem.tsx"
}
```

Use this exact particle body:

```mdx
# Canvas 粒子力场

这是原始个人门户中的粒子背景实验。新版网站不再把持续动画放在首页，而是将它保留为一件可以独立运行和复盘的技术藏品。

## 实现要点

- 使用 Canvas 逐帧绘制粒子。
- 指针进入影响半径后对粒子施加排斥力。
- 粒子到达边界后反向移动。
- 组件卸载时取消动画帧并移除事件监听。
- Canvas 不可用或用户减少动态效果时显示静态背景。
```

Use this exact typewriter metadata:

```json
{
  "slug": "typewriter-effect",
  "title": { "zh-CN": "循环打字机模块", "en-US": "Looping Typewriter Module" },
  "summary": { "zh-CN": "一个使用 reducer 状态机控制输入、停顿、删除和循环阶段的文字模块。", "en-US": "A reducer-driven text module for typing, pausing, deleting, and looping." },
  "type": "module",
  "tags": ["React", "Reducer", "Animation"],
  "createdAt": "2026-03-12",
  "updatedAt": "2026-07-31",
  "status": "published",
  "featured": true,
  "cover": "/covers/typewriter-effect.svg",
  "demoKey": "typewriter-effect",
  "sourceUrl": "https://github.com/zhangcycoder/zcy-corner/blob/dev_1/personal-portal/src/components/Typewriter.tsx"
}
```

Use this exact typewriter body:

```mdx
# 循环打字机模块

这个模块把打字、停顿、删除和切换文字拆成明确的状态转换，避免用多个互相影响的布尔状态拼接动画流程。

## 状态流程

1. 按固定间隔追加字符。
2. 完整文字显示后进入停顿。
3. 以更快速度逐字删除。
4. 切换到下一段文字并重新开始。

组件接受文字数组、字符间隔和停顿时间。字符间隔会限制在 100ms 以内，并在卸载时清理定时器。
```

- [ ] **Step 4: Create three original SVG covers**

Create the SVG files with these exact text-free compositions.

`public/covers/personal-portal.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720">
  <rect width="1200" height="720" fill="#0b0c0f"/>
  <path d="M720 0h480v720H540z" fill="#eeeae2"/>
  <circle cx="390" cy="300" r="150" fill="none" stroke="#7188ff" stroke-width="4"/>
  <circle cx="390" cy="300" r="42" fill="#7188ff"/>
  <path d="M760 180h290M720 270h330M680 360h370M640 450h410" stroke="#0b0c0f" stroke-width="3" opacity=".35"/>
</svg>
```

`public/covers/particle-field.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720">
  <rect width="1200" height="720" fill="#0b0c0f"/>
  <g fill="none" stroke="#7188ff" opacity=".5">
    <circle cx="600" cy="360" r="210"/>
    <circle cx="600" cy="360" r="110"/>
    <path d="M190 490C380 120 820 120 1010 490"/>
  </g>
  <g fill="#eeeae2">
    <circle cx="350" cy="250" r="8"/><circle cx="520" cy="470" r="5"/>
    <circle cx="780" cy="220" r="7"/><circle cx="920" cy="430" r="4"/>
  </g>
  <circle cx="600" cy="360" r="28" fill="#7188ff"/>
</svg>
```

`public/covers/typewriter-effect.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720">
  <rect width="1200" height="720" fill="#eeeae2"/>
  <path d="M220 250h610M220 360h470M220 470h560" stroke="#0b0c0f" stroke-width="22"/>
  <rect x="840" y="232" width="18" height="56" fill="#7188ff"/>
  <circle cx="960" cy="470" r="74" fill="#0b0c0f"/>
  <circle cx="960" cy="470" r="22" fill="#7188ff"/>
</svg>
```

- [ ] **Step 5: Review catalog integrity**

Confirm all three directory names match their `slug`, all three MDX bodies exist, and all three covers use the exact paths declared in metadata.

- [ ] **Step 6: Commit locally**

```bash
git add src/content public/covers
git commit -m "feat(portal): seed vault with real project artifacts"
```

Do not push.

---

### Task 3: Gallery & Paper Shell, Navigation, and Page Metadata

**Files:**
- Create: `src/components/layout/SiteHeader.tsx`
- Create: `src/components/layout/SiteFooter.tsx`
- Create: `src/components/layout/SiteShell.tsx`
- Create: `src/hooks/usePageMeta.ts`
- Create: `src/styles/tokens.css`
- Create: `src/styles/site.css`
- Create: `src/styles/content.css`
- Modify: `src/styles/global.css`
- Modify: `src/main.tsx`
- Modify: `src/App.tsx`
- Modify: `src/pages/HomePage.tsx`
- Create: `src/pages/VaultPage.tsx`
- Create: `src/pages/TreasureDetailPage.tsx`
- Create: `src/pages/ResumePage.tsx`
- Create: `src/pages/LegacyProjectRedirect.tsx`
- Modify: `src/i18n/index.ts`
- Modify: `src/i18n/locales/zh-CN.json`
- Modify: `src/i18n/locales/en-US.json`

**Interfaces:**
- Consumes: React Router location and `getTreasureBySlug`.
- Produces: route-aware `SiteShell`, `SiteHeader`, `SiteFooter`, `usePageMeta()`.
- Later pages render inside `<Outlet />`.

- [ ] **Step 1: Define design tokens and global behavior**

Create tokens for:

```css
:root {
  --color-gallery: #0b0c0f;
  --color-gallery-elevated: #15171c;
  --color-paper: #eeeae2;
  --color-paper-muted: #d7d2c9;
  --color-ink: #171716;
  --color-text: #f0f0ec;
  --color-muted-dark: #97999f;
  --color-muted-light: #68645d;
  --color-accent: #7188ff;
  --color-line-dark: #282a2f;
  --color-line-light: #bdb8af;
  --font-sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-serif: Georgia, "Times New Roman", serif;
  --font-mono: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  --content-width: 1200px;
  --reading-width: 760px;
  --transition-fast: 180ms;
  --transition-base: 240ms;
}
```

`global.css` imports Tailwind, tokens, site and content styles; resets the old Vite body/root constraints; adds visible `:focus-visible`; and disables non-essential transitions under `prefers-reduced-motion: reduce`.

Replace the imports at the top of `src/main.tsx` with:

```ts
import './i18n'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.tsx'
```

Do not import the old `src/index.css`.

- [ ] **Step 2: Implement the route-aware shell**

`SiteShell` uses `useLocation()` and `matchPath('/vault/:slug', pathname)`. It selects Paper for `/resume` and note details; all other routes use Gallery. Render:

```tsx
<div className="site-shell" data-scene={scene}>
  <a className="skip-link" href="#main-content">跳到主要内容</a>
  <SiteHeader scene={scene} />
  <main id="main-content"><Outlet /></main>
  <SiteFooter />
</div>
```

The header contains real route links for 首页、藏宝阁、简历 and a compact language switcher. The mobile version uses a native button with `aria-expanded` and closes after navigation.

- [ ] **Step 3: Add reusable page metadata**

Create `src/hooks/usePageMeta.ts`:

```ts
import { useEffect } from 'react'

export interface PageMeta {
  title: string
  description: string
  image?: string
}

/**
 * @name 同步页面元信息
 * @description 路由变化后同步标题、描述和分享图片；卸载时由下一个页面覆盖。
 */
export function usePageMeta({ title, description, image }: PageMeta): void {
  useEffect(() => {
    document.title = title

    const upsert = (selector: string, attribute: string, value: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector)
      if (!element) {
        element = document.createElement('meta')
        const [key, name] = selector.includes('property=')
          ? ['property', selector.match(/property="([^"]+)"/)?.[1]]
          : ['name', selector.match(/name="([^"]+)"/)?.[1]]
        if (name) element.setAttribute(key, name)
        document.head.appendChild(element)
      }
      element.setAttribute(attribute, value)
    }

    upsert('meta[name="description"]', 'content', description)
    upsert('meta[property="og:title"]', 'content', title)
    upsert('meta[property="og:description"]', 'content', description)
    if (image) upsert('meta[property="og:image"]', 'content', image)
  }, [description, image, title])
}
```

- [ ] **Step 4: Replace App routes**

Use this route map:

```tsx
<BrowserRouter>
  <Routes>
    <Route element={<SiteShell />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/vault" element={<VaultPage />} />
      <Route path="/vault/:slug" element={<TreasureDetailPage />} />
      <Route path="/resume" element={<ResumePage />} />
      <Route path="/projects/:id" element={<LegacyProjectRedirect />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
</BrowserRouter>
```

Keep this commit buildable by adding these exact minimal route modules before replacing them in later tasks:

```tsx
// HomePage.tsx
export default function HomePage() {
  return <section className="gallery-page"><h1>个人技术空间</h1></section>
}

// VaultPage.tsx
export default function VaultPage() {
  return <section className="gallery-page"><h1>技术藏宝阁</h1></section>
}

// TreasureDetailPage.tsx
export default function TreasureDetailPage() {
  return <section className="gallery-page"><h1>藏品详情</h1></section>
}

// ResumePage.tsx
export default function ResumePage() {
  return <section className="paper-page"><h1>简历舱</h1></section>
}

// LegacyProjectRedirect.tsx
import { Navigate } from 'react-router-dom'

export default function LegacyProjectRedirect() {
  return <Navigate replace to="/vault" />
}
```

- [ ] **Step 5: Set Chinese fallback**

Change `fallbackLng` from `en-US` to `zh-CN`. Replace old translation keys with:

- `nav.home`, `nav.vault`, `nav.resume`, `nav.about`;
- `common.viewAll`, `common.backHome`, `common.backVault`;
- type labels for all five treasure types;
- concise 404 and resume labels.

English UI labels remain present; content bodies fall back through `resolveLocalizedText`.

- [ ] **Step 6: Commit locally**

```bash
git add src/components/layout src/hooks/usePageMeta.ts src/styles src/main.tsx src/App.tsx src/i18n
git commit -m "feat(portal): add gallery and paper site shell"
```

Do not push.

---

### Task 4: Homepage and Vault Index

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/pages/VaultPage.tsx`
- Create: `src/components/vault/TreasureCard.tsx`
- Create: `src/components/vault/VaultFilter.tsx`
- Modify: `src/styles/site.css`

**Interfaces:**
- Consumes: `getFeaturedTreasures()`, `getPublishedTreasures()`, `getTreasureTypes()`, `resolveLocalizedText()`.
- Produces: public homepage and filterable vault index.

- [ ] **Step 1: Build the homepage in Gallery mode**

Render these sections in order:

```tsx
<div className="gallery-page home-page">
  <section className="home-hero">identity claim + current focus</section>
  <section className="home-featured">three TreasureCard items</section>
  <section className="home-latest">latest update links</section>
  <section className="home-resume-cta">resume and GitHub links</section>
</div>
```

Use the approved copy:

- eyebrow: `FRONTEND ENGINEER · DIGITAL BUILDER`
- title: `构建值得留下的数字体验。`
- description: `这里收录我的技术实践、可复用模块、交互实验和职业经历。`
- focus: `AI 辅助研发`、`前端工程化`、`交互体验`

The primary CTA goes to `/vault`; the secondary CTA goes to `/resume`.

- [ ] **Step 2: Implement an accessible TreasureCard**

`TreasureCard` accepts:

```ts
interface TreasureCardProps {
  treasure: TreasureRecord
  locale: string
  priority?: boolean
}
```

The whole card uses a semantic `<article>` with a real `<Link>`, an image with explicit `width` and `height`, type/date metadata, localized title/summary, tags, and a visible arrow. Image failure replaces the image with a stable `.treasure-cover-fallback` element instead of hiding the layout.

- [ ] **Step 3: Implement URL-backed type filtering**

`VaultFilter` accepts the available types, selected type and `onChange`. `VaultPage` stores the selected type in `?type=demo` through `useSearchParams`, so reload and browser back preserve it. Unknown type values behave as `all`.

Do not add text search, tag multi-select or sorting controls.

- [ ] **Step 4: Add responsive Gallery layout**

Use semantic CSS classes:

- `.home-hero` becomes two columns above 900px and one column below.
- `.treasure-grid` uses three columns, then two, then one.
- `.treasure-card` changes only image scale, title color and arrow offset on hover.
- all hover-only feedback has equivalent `:focus-within` behavior.

- [ ] **Step 5: Commit locally**

```bash
git add src/pages/HomePage.tsx src/pages/VaultPage.tsx src/components/vault src/styles/site.css
git commit -m "feat(portal): build homepage and vault index"
```

Do not push.

---

### Task 5: Treasure Detail, Demo Isolation, and Legacy Routes

**Files:**
- Create: `src/demos/particle-field/index.tsx`
- Create: `src/demos/typewriter-effect/index.tsx`
- Create: `src/demos/registry.ts`
- Create: `src/components/vault/DemoBoundary.tsx`
- Create: `src/components/vault/DemoStage.tsx`
- Modify: `src/pages/TreasureDetailPage.tsx`
- Modify: `src/pages/LegacyProjectRedirect.tsx`
- Modify: `src/styles/content.css`
- Modify: `src/styles/site.css`

**Interfaces:**
- Consumes: `getTreasureBySlug()`, legacy ID map, existing `ParticleSystem`, existing `Typewriter`.
- Produces: `DemoKey`, `loadDemo()`, resilient detail route and redirects.

- [ ] **Step 1: Register demos explicitly**

Create `src/demos/registry.ts`:

```ts
import type { ComponentType } from 'react'

export type DemoKey = 'particle-field' | 'typewriter-effect'

const demoLoaders: Record<DemoKey, () => Promise<{ default: ComponentType }>> = {
  'particle-field': () => import('./particle-field'),
  'typewriter-effect': () => import('./typewriter-effect'),
}

/**
 * @name 加载藏品 Demo
 * @returns 未注册的 key 返回 undefined，由页面降级为图文说明。
 */
export function loadDemo(key: string | undefined) {
  return key && key in demoLoaders ? demoLoaders[key as DemoKey] : undefined
}
```

The particle wrapper creates a positioned container and passes `disabled` when `prefers-reduced-motion: reduce` matches. The typewriter wrapper shows the approved three phrases and does not inject full-screen effects.

- [ ] **Step 2: Isolate demo failures**

`DemoBoundary` is a React class error boundary with a concise fallback:

```tsx
<div className="demo-fallback" role="status">
  <p>这个实验暂时无法运行。</p>
  <p>正文与源码仍可继续查看。</p>
</div>
```

`DemoStage` calls `loadDemo`, uses `lazy(loader)`, wraps it with `Suspense` and `DemoBoundary`, and renders nothing when the treasure has no registered `demoKey`.

- [ ] **Step 3: Build the hybrid detail page**

`TreasureDetailPage`:

1. Gets `slug` from `useParams`.
2. Returns `NotFoundPage` when no published item exists.
3. Uses Gallery header and optional Demo stage for project/demo/ui/module types.
4. Places localized title, summary, metadata, MDX body and resource links in a Paper article.
5. Uses `usePageMeta` with the item cover.
6. Renders external links with `target="_blank"` and `rel="noopener noreferrer"`.

The body container uses `.prose-content` styles for headings, paragraphs, lists, links, blockquotes, `pre`, `code`, images and tables.

- [ ] **Step 4: Preserve old public routes**

Use this explicit legacy map:

```ts
const LEGACY_PROJECT_SLUGS: Record<string, string> = {
  'personal-portal': 'personal-portal',
}
```

Known IDs render `<Navigate replace to={`/vault/${slug}`} />`; unknown IDs render `NotFoundPage`. Do not redirect the three old fabricated example projects to unrelated new content.

- [ ] **Step 5: Commit locally**

```bash
git add src/demos src/components/vault src/pages/TreasureDetailPage.tsx src/pages/LegacyProjectRedirect.tsx src/styles
git commit -m "feat(portal): add treasure detail and demo stage"
```

Do not push.

---

### Task 6: Printable Resume Chamber

**Files:**
- Create: `src/content/resume/profile.ts`
- Modify: `src/pages/ResumePage.tsx`
- Modify: `src/styles/content.css`
- Modify: `src/styles/site.css`

**Interfaces:**
- Produces: `Profile`, `SkillGroup`, `ResumeEntry`, `profile`.
- Consumed by: `ResumePage`; later real career entries only update `profile.ts`.

- [ ] **Step 1: Define a privacy-safe structured profile**

Create these interfaces and data:

```ts
export interface ProfileLink {
  label: string
  href: string
}

export interface SkillGroup {
  title: string
  items: string[]
}

export interface ResumeEntry {
  id: string
  period: string
  role: string
  organization: string
  summary: string
  background: string
  actions: string[]
  challenges: string[]
  results: string[]
}

export interface Profile {
  displayName: string
  role: string
  location: string
  headline: string
  summary: string
  focus: string[]
  links: ProfileLink[]
  skillGroups: SkillGroup[]
  entries: ResumeEntry[]
}

export const profile: Profile = {
  displayName: 'ZCY',
  role: '前端开发者',
  location: '中国 · 上海',
  headline: '构建、记录、持续进化',
  summary: '关注前端工程化、交互体验与 AI 辅助研发，并通过持续实践沉淀可复用的技术资产。',
  focus: ['AI 辅助研发', '前端工程化', '交互体验'],
  links: [
    { label: 'GitHub', href: 'https://github.com/zhangcycoder' },
  ],
  skillGroups: [
    { title: '前端', items: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'] },
    { title: '体验', items: ['响应式界面', '交互动效', 'Canvas', '国际化'] },
    { title: '工程', items: ['Git', 'Netlify', '构建工具', '代码质量'] },
  ],
  entries: [
    {
      id: 'personal-tech-space',
      period: '2026 — 至今',
      role: '独立开发',
      organization: 'Personal Tech Space',
      summary: '设计并持续建设个人技术网站，用于技术沉淀、作品展示和职业信息表达。',
      background: '原有站点可以部署，但内容与结构仍停留在模板阶段。',
      actions: ['重新定义网站信息架构', '建立文件驱动的藏品模型', '设计 Gallery & Paper 双场景视觉系统'],
      challenges: ['在展示效果与长文阅读之间保持统一', '控制首期范围并保留后续扩展能力'],
      results: ['形成可持续维护的网站结构', '建立 GitHub 到 Netlify 的发布链路记录'],
    },
  ],
}
```

Do not add the Netlify account email, employer, education, years of experience or proficiency percentages.

- [ ] **Step 2: Implement layered resume disclosure**

`ResumePage` renders:

- identity and summary;
- links and focus;
- grouped skills without percentages;
- experience summaries using native `<details>` and `<summary>`;
- expanded background, actions, challenges and results;
- a `window.print()` button.

Use `usePageMeta` with a resume-specific title and description.

- [ ] **Step 3: Add print CSS**

Inside `@media print`:

- set Paper background to white;
- hide `.site-header`, `.site-footer`, `.print-hidden`;
- open all resume details visually through CSS;
- remove shadows and transitions;
- keep links readable without printing raw Netlify URLs;
- set page margins with `@page { margin: 16mm; }`.

- [ ] **Step 4: Commit locally**

```bash
git add src/content/resume/profile.ts src/pages/ResumePage.tsx src/styles
git commit -m "feat(portal): add printable resume chamber"
```

Do not push.

---

### Task 7: Remove Template Surfaces and Finish Public Metadata

**Files:**
- Modify: `src/pages/NotFoundPage.tsx`
- Modify: `index.html`
- Modify: `README.md`
- Modify: `src/types/index.ts`
- Create: `public/favicon.svg`
- Delete: `src/components/AboutSection.tsx`
- Delete: `src/components/AboutSection.test.tsx`
- Delete: `src/components/ContactSection.tsx`
- Delete: `src/components/HeroSection.tsx`
- Delete: `src/components/HeroSection.test.tsx`
- Delete: `src/components/LangSwitcher.tsx`
- Delete: `src/components/Nav.tsx`
- Delete: `src/components/Nav.test.tsx`
- Delete: `src/components/ProjectsSection.tsx`
- Delete: `src/components/ProjectCard.tsx`
- Delete: `src/components/ScanLine.tsx`
- Delete: `src/components/SkillsSection.tsx`
- Delete: `src/data/navItems.ts`
- Delete: `src/data/projectsData.ts`
- Delete: `src/data/skillsData.ts`
- Delete: `src/hooks/useScrollSpy.ts`
- Delete: `src/App.css`
- Delete: `src/index.css`
- Delete: `src/assets/react.svg`
- Delete: `public/vite.svg`

**Interfaces:**
- Preserves: `ParticleSystem`, `Typewriter`, `useIntersectionObserver`, and their existing tests.
- Produces: no remaining rendered or source-level template identity such as `YOUR NAME` or `example.com`.

- [ ] **Step 1: Finish the 404 page**

Use the current scene from `SiteShell`, render a concise `404` heading, explanatory text, and links to `/` and `/vault`. Do not duplicate the site header inside the page.

- [ ] **Step 2: Replace document metadata and favicon**

Set:

```html
<html lang="zh-CN">
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<meta name="description" content="ZCY 的个人技术空间，收录技术实践、交互实验、可复用模块与职业经历。" />
<meta name="theme-color" content="#0b0c0f" />
<title>ZCY · Personal Tech Space</title>
```

Create a text-free favicon using a single cold-blue dot within a dark square.

- [ ] **Step 3: Remove obsolete template files**

Delete the listed files only after confirming no production import points at them. Keep `ParticleSystem.tsx`, `Typewriter.tsx`, their tests and `test-setup.ts`.

Reduce `src/types/index.ts` to the `Particle` interface still consumed by `ParticleSystem`; remove obsolete `Project`, `Skill` and `NavItem` declarations.

- [ ] **Step 4: Update README without losing deployment records**

Preserve the current live URL, Netlify console, GitHub repository, production branch and build settings. Replace the old Vite template notes with:

- product purpose;
- route map;
- Gallery & Paper explanation;
- content authoring instructions for `meta.json` + `index.mdx`;
- local commands;
- explicit statement that Netlify credentials remain local and untracked.

- [ ] **Step 5: Scan for public placeholders**

After user authorizes verification, use:

```bash
rg -n 'YOUR NAME|hello@example.com|github.com/example|linkedin.com/in/example|example.com/(portal|dashboard|ai-review)' src public index.html README.md
```

Expected: no matches.

- [ ] **Step 6: Commit locally**

```bash
git add src public index.html README.md
git commit -m "chore(portal): remove legacy template surfaces"
```

Do not add `../.DS_Store`. Do not push.

---

### Task 8: Verification Gate and Local Handoff

**Files:**
- Modify only files required to fix confirmed verification failures.

**Interfaces:**
- Consumes: all previous task deliverables.
- Produces: a locally committed, deployable `dev_1` branch with no remote mutation.

- [ ] **Step 1: Ask for verification permission**

Ask once before running commands:

> 首期实现已经完成。是否允许我依次运行内容扫描、构建、Lint、现有测试和本地页面检查？不会 push 或触发远程部署。

If permission is not granted, skip to Step 6 and report that verification was not run.

- [ ] **Step 2: Run the narrow static checks**

Run:

```bash
rg -n 'YOUR NAME|hello@example.com|github.com/example|linkedin.com/in/example|example.com/(portal|dashboard|ai-review)' src public index.html README.md
npm run build
npm run lint
```

Expected:

- placeholder scan prints nothing;
- build exits `0` and produces `dist`;
- lint exits `0`.

- [ ] **Step 3: Run existing tests without adding new tests**

Run:

```bash
npx vitest run
```

Expected: existing `ParticleSystem` and `Typewriter` suites pass. No new test file is created.

- [ ] **Step 4: Inspect the local production build**

Run `npm run preview -- --host 127.0.0.1`, then inspect:

- `/`;
- `/vault`;
- `/vault/personal-portal`;
- `/vault/particle-field`;
- `/vault/typewriter-effect`;
- `/resume`;
- `/projects/personal-portal`;
- an unknown path.

Check desktop and mobile widths, keyboard focus, reduced-motion behavior, image fallback and print preview. Expected: all routes are usable and legacy project route redirects with `replace`.

- [ ] **Step 5: Commit only verification fixes**

If checks required code fixes, stage only project implementation paths:

```bash
git add -- src public index.html README.md package.json package-lock.json vite.config.ts tsconfig.app.json
git commit -m "fix(portal): resolve foundation verification issues"
```

If no fix is needed, create no empty commit.

- [ ] **Step 6: Report local state and stop**

Report:

- commit hashes created;
- checks actually run and their result;
- remaining real-content work;
- current Netlify production URL;
- explicit statement: `No push performed`.

Do not run `git push`. Do not open Netlify deployment controls.
