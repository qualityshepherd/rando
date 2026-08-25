import { trackHit } from './hit.js'
import { handleRandoRoute } from './rando.js'

export default {
  async fetch (req, env, ctx) {
    const url = new URL(req.url)
    const path = url.pathname

    if (path === '/.well-known/webfinger') {
      return Response.redirect(`https://fed.brid.gy/.well-known/webfinger${url.search}`, 302)
    }

    ctx.waitUntil(trackHit(req, env))

    if (path === '/') return handleRandoRoute()

    return env.ASSETS.fetch(req)
  }
}
