import { test } from 'node:test'
import assert from 'node:assert/strict'
import { shouldSkip, trackHit } from '../../worker/hit.js'

// shouldSkip — app-specific "is this even a pageview" filtering. Bot/device/
// RSS classification now happens in chalk, not here.
test('shouldSkip: skips static extensions', () => { assert.ok(shouldSkip('/assets/css/style.css')) })
test('shouldSkip: skips png', () => { assert.ok(shouldSkip('/apple-touch-icon.png')) })
test('shouldSkip: skips mp3', () => { assert.ok(shouldSkip('/pods/episode.mp3')) })
test('shouldSkip: skips js by extension', () => { assert.ok(shouldSkip('/src/app.js')) })
test('shouldSkip: skips /favicon paths', () => { assert.ok(shouldSkip('/favicon.png')) })
test('shouldSkip: skips /data paths', () => { assert.ok(shouldSkip('/data/sparks.json')) })
test('shouldSkip: skips /env paths (scanner probes)', () => { assert.ok(shouldSkip('/env')) })
test('shouldSkip: skips /nodeinfo paths', () => { assert.ok(shouldSkip('/nodeinfo/2.1')) })
test('shouldSkip: skips /.well-known/nodeinfo', () => { assert.ok(shouldSkip('/.well-known/nodeinfo')) })
test('shouldSkip: normal path is not skipped', () => { assert.ok(!shouldSkip('/')) })
test('shouldSkip: extension check ignores query string', () => { assert.ok(shouldSkip('/style.css?v=2')) })

async function withMockFetch (impl, fn) {
  const originalFetch = globalThis.fetch
  globalThis.fetch = impl
  try {
    await fn()
  } finally {
    globalThis.fetch = originalFetch
  }
}

test('trackHit: forwards raw signal to chalk', async () => {
  let captured = null
  await withMockFetch(async (url, init) => {
    captured = { url, init }
    return new Response('ok')
  }, async () => {
    const req = new Request('https://rando.brine.dev/', {
      headers: { 'cf-connecting-ip': '1.2.3.4', 'user-agent': 'Mozilla/5.0' }
    })
    await trackHit(req, { CHALK_HIT_SECRET: 'secret', DOMAIN_NAME: 'rando.brine.dev' })
  })

  assert.ok(captured !== null)
  assert.equal(captured.url, 'https://chalk.brine.dev/hit')
  assert.equal(captured.init.headers['x-hit-secret'], 'secret')

  const body = JSON.parse(captured.init.body)
  assert.equal(body.domain, 'rando.brine.dev')
  assert.equal(body.path, '/')
  assert.equal(body.ip, '1.2.3.4')
  assert.equal(body.ua, 'Mozilla/5.0')
})

test('trackHit: does not forward asset requests', async () => {
  let called = false
  await withMockFetch(async () => { called = true; return new Response('ok') }, async () => {
    const req = new Request('https://rando.brine.dev/assets/css/style.css', {
      headers: { 'cf-connecting-ip': '1.2.3.4' }
    })
    await trackHit(req, { CHALK_HIT_SECRET: 'secret', DOMAIN_NAME: 'rando.brine.dev' })
  })

  assert.ok(!called)
})

test('trackHit: does nothing without CHALK_HIT_SECRET configured', async () => {
  let called = false
  await withMockFetch(async () => { called = true; return new Response('ok') }, async () => {
    const req = new Request('https://rando.brine.dev/', { headers: { 'cf-connecting-ip': '1.2.3.4' } })
    await trackHit(req, {})
  })

  assert.ok(!called)
})

test('trackHit: does nothing without a resolvable IP', async () => {
  let called = false
  await withMockFetch(async () => { called = true; return new Response('ok') }, async () => {
    const req = new Request('https://rando.brine.dev/')
    await trackHit(req, { CHALK_HIT_SECRET: 'secret', DOMAIN_NAME: 'rando.brine.dev' })
  })

  assert.ok(!called)
})
