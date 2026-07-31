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
    { enforce: 'pre', ...mdx() },
    react({ include: /\.(js|jsx|ts|tsx|md|mdx)$/ }),
    tailwindcss(),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
})
