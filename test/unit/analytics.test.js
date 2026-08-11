import { unit as test } from '../testpup.js'
import { buildHit, countryFlag, classifyHit, isBot, trackHit, handleAnalytics, parseDevice, parseRssSubscribers } from '../../worker/analytics.js'

// isBot
test('Analytics: isBot detects php probe', t => { t.ok(isBot('/wp-login.php')) })
test('Analytics: isBot detects env probe', t => { t.ok(isBot('/.env')) })
test('Analytics: isBot detects wp- probe', t => { t.ok(isBot('/wp-admin/setup')) })
test('Analytics: isBot ignores static extension — classifyHit handles it', t => { t.falsy(isBot('/assets/css/style.css')) })
test('classifyHit: skips static extensions', t => { t.is(classifyHit('/assets/css/style.css'), 'skip') })
test('classifyHit: skips png', t => { t.is(classifyHit('/apple-touch-icon.png'), 'skip') })
test('classifyHit: skips mp3', t => { t.is(classifyHit('/pods/episode.mp3'), 'skip') })
test('classifyHit: datacenter ASN on asset path is skipped not bot', t => { t.is(classifyHit('/logo.png', '', 15169), 'skip') })
test('Analytics: isBot detects swagger probe', t => { t.ok(isBot('/swagger/swagger-ui.html')) })
test('Analytics: isBot detects statistics.json probe', t => { t.ok(isBot('/statistics.json')) })
test('Analytics: isBot detects actuator probe', t => { t.ok(isBot('/actuator/env')) })
test('Analytics: isBot detects graphql probe', t => { t.ok(isBot('/graphql')) })
test('Analytics: isBot returns false for normal path', t => { t.falsy(isBot('/posts/my-post')) })
test('Analytics: isBot returns false for root', t => { t.falsy(isBot('/')) })
test('Analytics: isBot is case insensitive', t => { t.ok(isBot('/XMLRPC.PHP')) })
test('Analytics: isBot allows real browser UA', t => { t.falsy(isBot('/', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')) })

// .DS_Store case-insensitive bug
test('Analytics: isBot detects .DS_Store anywhere in path', t => { t.ok(isBot('/posts/.DS_Store')) })
test('Analytics: isBot detects .DS_Store in subdir', t => { t.ok(isBot('/worker/.DS_Store')) })
test('Analytics: isBot detects .DS_Store mixed case via lowercase path', t => { t.ok(isBot('/assets/.DS_Store')) })

// template literal scraper detection
test('Analytics: isBot detects unrendered template literal in path', t => { t.ok(isBot('/src/$' + '{url}')) })
test('Analytics: isBot detects URL-encoded %24%7B template literal', t => { t.ok(isBot('/src/%24%7B')) })
test('Analytics: isBot detects URL-encoded %7B brace', t => { t.ok(isBot('/src/%7Bavatar%7D')) })

// classifyHit — /src should be skipped entirely, not counted as bot
test('classifyHit: skips /src paths', t => { t.is(classifyHit('/src/app.js'), 'skip') })
test('classifyHit: skips /src with subpath', t => { t.is(classifyHit('/src/%24%7Burl%7D'), 'skip') })
test('classifyHit: normal post is a hit', t => { t.is(classifyHit('/posts/my-post'), 'hit') })
test('classifyHit: .DS_Store is a bot', t => { t.is(classifyHit('/posts/.DS_Store'), 'bot') })

// countryFlag
test('Analytics: countryFlag returns span with flag and title', t => {
  const result = countryFlag('US')
  t.ok(result.includes('title="US"'))
  t.ok(result.includes('<span'))
})
test('Analytics: countryFlag returns empty string for unknown', t => { t.is(countryFlag('?'), '') })

// buildHit
test('buildHit: has region field', t => {
  t.ok('region' in buildHit('/post', { country: 'US', city: 'NYC', region: 'NY' }, 'abc123'))
})
test('buildHit: includes country and city', t => {
  const hit = buildHit('/post', { country: 'DE', city: 'Berlin' }, 'abc123')
  t.is(hit.country, 'DE')
  t.is(hit.city, 'Berlin')
})
test('buildHit: derives hour from ts', t => {
  const ts = new Date('2026-03-03T14:30:00Z').getTime()
  t.is(buildHit('/post', {}, 'abc', '', ts).hour, 14)
})
test('buildHit: defaults country and city to ?', t => {
  const hit = buildHit('/post', {}, 'abc')
  t.is(hit.country, '?')
  t.is(hit.city, '?')
})
test('buildHit: includes path and ip', t => {
  const hit = buildHit('/posts/foo', { country: 'US' }, 'hashval')
  t.is(hit.path, '/posts/foo')
  t.is(hit.ip, 'hashval')
})
test('buildHit: includes asn from cf', t => {
  const hit = buildHit('/post', { asn: 14061 }, 'abc')
  t.is(hit.asn, 14061)
})
test('buildHit: defaults asn to null', t => {
  const hit = buildHit('/post', {}, 'abc')
  t.is(hit.asn, null)
})

// parseDevice & parseRssSubscribers
test('parseDevice: detects mobile UA', t => {
  t.is(parseDevice('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'), 'mobile')
})
test('parseDevice: defaults to desktop', t => {
  t.is(parseDevice('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'), 'desktop')
})

test('parseRssSubscribers: parses Feedbin', t => {
  const res = parseRssSubscribers('Feedbin feed-id:123 - 42 subscribers')
  t.is(res.aggregator, 'Feedbin')
  t.is(res.subscribers, 42)
})

// D1 tracking tests
test('trackHit: inserts hit record into D1 DB', async t => {
  let inserted = null
  const mockDb = {
    prepare (query) {
      return {
        bind (...args) {
          inserted = { query, args }
          return { run: async () => ({}) }
        }
      }
    }
  }

  const req = new Request('https://rando.brine.dev/', {
    headers: { 'cf-connecting-ip': '1.2.3.4', 'user-agent': 'Mozilla/5.0' }
  })
  await trackHit(req, { DB: mockDb })

  t.ok(inserted !== null)
  t.ok(inserted.query.includes('INSERT INTO hits'))
  t.is(inserted.args[1], '/') // path
  t.is(inserted.args[8], 0) // is_bot = 0
})

test('trackHit: inserts bot record into D1 DB for scanners', async t => {
  let inserted = null
  const mockDb = {
    prepare (query) {
      return {
        bind (...args) {
          inserted = { query, args }
          return { run: async () => ({}) }
        }
      }
    }
  }

  const req = new Request('https://rando.brine.dev/wp-login.php', {
    headers: { 'cf-connecting-ip': '1.2.3.4' }
  })
  await trackHit(req, { DB: mockDb })

  t.ok(inserted !== null)
  t.is(inserted.args[1], '/wp-login.php')
  t.is(inserted.args[8], 1) // is_bot = 1
})

test('handleAnalytics: aggregates D1 hits by day', async t => {
  const ts = Date.now()
  const mockDb = {
    prepare (query) {
      return {
        bind () {
          return {
            all: async () => ({
              results: [
                { ts, path: '/', country: 'US', city: 'NYC', region: 'NY', device: 'desktop', referrer: '', ip_hash: 'abc', is_bot: 0, asn: null, rss_feed: null, rss_subs: null }
              ]
            })
          }
        }
      }
    }
  }

  const req = new Request('https://rando.brine.dev/api/analytics?days=1')
  const res = await handleAnalytics(req, { DB: mockDb }, 'rando.brine.dev')
  const json = await res.json()

  t.ok(Array.isArray(json))
  t.is(json[0].data.totalHits, 1)
  t.is(json[0].data.uniques, 1)
})
