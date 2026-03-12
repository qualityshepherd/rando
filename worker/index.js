import { trackHit, handleAnalytics, AnalyticsDO } from './analytics.js'

export { AnalyticsDO }

export const isAuthorized = (secret, adminSecret) =>
  !!secret && !!adminSecret && secret === adminSecret

export default {
  async fetch (req, env, ctx) {
    const url = new URL(req.url)
    const path = url.pathname

    if (path === '/api/analytics') {
      const secret = url.searchParams.get('secret')
      if (!isAuthorized(secret, env.ADMIN_SECRET)) return new Response('Unauthorized', { status: 401 })
      return handleAnalytics(req, env, url.hostname)
    }

    if (path === '/api/hit' && req.method === 'POST') {
      ctx.waitUntil(trackHit(req, env))
      return new Response('ok')
    }

    ctx.waitUntil(trackHit(req, env))

    return env.ASSETS.fetch(req)
  },

  async scheduled (event, env, ctx) {
    ctx.waitUntil((async () => {
      try {
        const hostname = new URL(`https://${env.ASSETS_HOST || 'rando.brine.dev'}`).hostname
        const id = env.ANALYTICS.idFromName(hostname)
        const stub = env.ANALYTICS.get(id)
        await stub.fetch('https://do.local/ensureAlarm', { method: 'POST' })
      } catch (err) {
        console.error('Scheduled alarm check failed:', err)
      }
    })())
  }
}
