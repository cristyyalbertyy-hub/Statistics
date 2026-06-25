import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** Na Vercel cada commit tem SHA único → URLs de media mudam e a CDN não serve cópia antiga. */
function mediaCacheBustQuery(): string {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GITHUB_SHA
  if (sha) return `?v=${sha.slice(0, 7)}`
  return ''
}

export default defineConfig({
  plugins: [react()],
  define: {
    __ASSET_Q__: JSON.stringify(mediaCacheBustQuery()),
  },
})
