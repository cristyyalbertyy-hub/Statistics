import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** Standalone Vercel app uses `/`. Site Medical embed uses `/statistics/`. */
const base = process.env.STUDIO9_SITE_BASE || '/'

/** Na Vercel cada commit tem SHA único → URLs de media mudam e a CDN não serve cópia antiga. */
function mediaCacheBustQuery(): string {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GITHUB_SHA
  if (sha) return `?v=${sha.slice(0, 7)}`
  return ''
}

const loadFallbackScript = `(function(){window.setTimeout(function(){var root=document.getElementById('root');if(root&&!root.childElementCount){root.innerHTML='<div style="font-family:DM Sans,system-ui,sans-serif;max-width:32rem;margin:3rem auto;padding:0 1.25rem;color:#14213d;line-height:1.5"><h1 style="font-size:1.25rem;margin:0 0 0.75rem">Medical Statistics</h1><p style="margin:0 0 0.75rem">The app did not load — usually an outdated cached file in your browser.</p><p style="margin:0"><strong>Try:</strong> hard refresh (Ctrl+Shift+R) or open in a private window.</p></div>';}},4500);})();`

export default defineConfig({
  base,
  plugins: [
    react(),
    {
      name: 'inject-load-fallback',
      transformIndexHtml(html) {
        return html.replace(
          '</body>',
          `<script>${loadFallbackScript}</script></body>`,
        )
      },
    },
  ],
  define: {
    __ASSET_Q__: JSON.stringify(mediaCacheBustQuery()),
  },
})
