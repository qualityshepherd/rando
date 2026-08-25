// Paths/extensions that are never a meaningful pageview (assets, internal
// routes) — this is app-specific routing knowledge chalk can't know, so it
// stays here. Everything else gets forwarded to chalk as raw signal; bot,
// device, and RSS-subscriber classification all happen there now, not here.
const SKIP_PATHS = ['/data', '/favicon', '/robots.txt']

const SKIP_EXTENSIONS = [
  '.bak', '.css', '.ico', '.gz', '.jpg', '.js', '.mp3', '.otf', '.png', '.rar', '.svg', '.tar', '.ttf', '.webp', '.woff', '.woff2', '.zip'
]

export const shouldSkip = (path) => {
  if (SKIP_PATHS.some(p => path.startsWith(p))) return true
  const lower = path.toLowerCase().split('?')[0]
  return SKIP_EXTENSIONS.some(e => lower.endsWith(e))
}

export async function trackHit (req, env) {
  if (!env.CHALK_HIT_SECRET) return

  const url = new URL(req.url)
  const path = url.searchParams.get('path') || (url.pathname + (url.search || ''))
  if (path.length > 500) return
  if (shouldSkip(path)) return

  const ip = req.cf?.clientIp ||
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    null
  if (!ip) return
  if (req.headers.get('cookie')?.includes('feedi_skip=1')) return

  const ua = req.headers.get('user-agent') || ''
  const cf = req.cf || {}

  const referer = req.headers.get('referer') || ''
  let referrer = ''
  try {
    if (referer && new URL(referer).hostname !== new URL(req.url).hostname) referrer = referer
  } catch {}

  await fetch('https://chalk.brine.dev/hit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hit-secret': env.CHALK_HIT_SECRET },
    body: JSON.stringify({
      domain: env.DOMAIN_NAME,
      path,
      referrer,
      ua,
      ip,
      country: cf.country,
      city: cf.city,
      region: cf.region,
      asn: cf.asn,
      ts: Date.now()
    })
  }).catch(() => {})
}
