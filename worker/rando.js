import sparksData from '../data/sparks.json'
import roomsData from '../data/rooms.json'
import totemData from '../data/totem.json'
import npcData from '../data/npc.json'
import tarotData from '../data/tarot.json'
import situationData from '../data/situation.json'
import miscData from '../data/misc.json'
import lootData from '../data/loot.json'

const rand = arr => arr[Math.floor(Math.random() * arr.length)]
const d6 = () => Math.floor(Math.random() * 6) + 1

function pickUnique (arr, n) {
  const result = new Set()
  while (result.size < n) result.add(rand(arr))
  return [...result]
}

function getRando () {
  const weatherArr = [d6(), 'rain/fog/snow', 'storm', 'wind', 'heat/cold', 'clouds', 'sun']
  const severityArr = [d6(), 'epic', 'fierce', 'intense', 'moderate', 'gentle', 'perfect']
  const card = { ...rand(tarotData) }
  if (d6() < 3) card.reversed = true

  return {
    male: rand(npcData.male),
    female: rand(npcData.female),
    they: rand(npcData.they),
    sur: rand(npcData.sur),
    role: rand(npcData.role),
    epithet: rand(npcData.epithet),
    trait: rand(npcData.trait),
    relationship: rand(npcData.relationship),
    belief: rand(npcData.belief),
    card,
    villageItem: rand(miscData.villageItem),
    dungeonItem: rand(miscData.dungeonItem),
    complication: rand(miscData.complication),
    threat: rand(miscData.threat),
    pocket: rand(miscData.pocket),
    trade: rand(miscData.trade),
    weather: weatherArr[weatherArr[0]],
    severity: severityArr[severityArr[0]],
    iconUrl: `/images/weather/${weatherArr[0]}.svg`,
    potion: `${rand(lootData.potion_adjective)}, ${rand(lootData.color)} liquid that ${rand(lootData.taste)} that makes the target <i>${rand(lootData.effect)}</i>`,
    loot: rand(lootData.type),
    magicItem: rand(lootData.magicItem),
    arrow: `/images/arrow/${d6()}.svg`,
    yesNoAndBut: ['No+', 'No', 'No?', 'Yes?', 'Yes', 'Yes+'][d6() - 1],
    sparks: pickUnique(sparksData, 4).join(', '),
    room: pickUnique(roomsData, 4).join(', '),
    totem: rand(totemData),
    situation: rand(situationData),
    coinAmount: d6() * d6() + d6()
  }
}

function renderPage () {
  const r = getRando()
  const orientation = r.card.reversed ? 'reversed' : 'upright'
  const description = r.card.reversed ? r.card.desc_reversed : r.card.desc_upright
  const threeWords = description.split(', ').sort(() => 0.5 - Math.random()).slice(0, 4).join(', ')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Rando: Spark generator for TTRPGs</title>
  <meta charset="utf-8">
  <meta name="description" content="A random spark generator for running ttrpgs...">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta property="og:url" content="https://rando.brine.dev/">
  <meta property="og:image" content="/images/rando.png">
  <meta property="og:image:width" content="1552">
  <meta property="og:image:height" content="1374">
  <link rel="preload" href="/fonts/Oswald-Regular.ttf" as="font" type="font/ttf" crossorigin>
  <link rel="preload" href="/fonts/Inter-Regular.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/css/site.css">
  <link rel="icon" href="/favicon.png">
</head>
<body>

<div id="container">
  <main>
    <right>
      <dice>
        <a class="dice" href="/" title="reroll...">
          ${[d6(), d6(), d6()].map(n => `<img src="/images/dice/${n}.svg" title="click to re-roll" />`).join('')}
        </a>
      </dice>

      <tarot>
        <div><img src="${r.card.url}" class="dim ${orientation}" alt="${r.card.name}" title="${r.card.name} ${orientation}" /></div>
        <div class="description small">${threeWords}</div>
        <p style="display: none;" class="copyToClipboard"><label>Tarot</label> ${r.card.name} ${orientation} - ${threeWords}</p>
      </tarot>

      <symbols>
        <img src="${r.iconUrl}" alt="${r.weather}" class="dim" title="${r.weather}" />
        <div class="small">${r.severity} ${r.weather}</div>
        <img src="${r.arrow}" class="dim" title="direction or hit location" />
        <div class="header dim" title="ask a question">${r.yesNoAndBut}</div>
      </symbols>
    </right>

    <left>
      <div class="npc">
        <div class="name header">[${r.male}, ${r.female}, ${r.they}] ${r.sur}</div>
        <div class="italic">${r.role}, ${r.epithet}, ${r.trait}${r.relationship ? `, ${r.relationship}` : ''}</div>
        <div class="belief"><label>Belief</label> ${r.belief}</div>
      </div>

      <div class="sparks header">Sparks <span class="copy dim small" title="copy sparks and tarot text" data-copy>✁</span></div>
      <div class="copyToClipboard"><label>Seeds</label> ${r.sparks}</div>
      <div class="copyToClipboard"><label>Threat</label> ${r.threat}</div>
      <div class="copyToClipboard"><label>Complication</label> ${r.complication}</div>
      <div class="copyToClipboard"><label>Room</label> ${r.room}</div>

      <div class="loot header">Loot</div>
      <div><label>Loot</label> ${r.coinAmount} coins and ${r.loot}</div>
      <div><label>Totem</label> ${r.totem}</div>
      <div><label>Found</label> ${r.villageItem}, ${r.dungeonItem}</div>
      <div><label>Pocket</label> ${r.pocket}</div>
      <div><label>Trade</label> ${r.trade}</div>
      <div><label>Magic</label> ${r.magicItem}</div>
      <div><label>Potion</label> ${r.potion}</div>

      <div class="situation header">Situation</div>
      <div>${r.situation}</div>
    </left>

    <footer>
      <div class="dim">
        <b>RANDO</b> is a random generator for TTRPGs
        <br>written by <a href="https://brine.dev"><b>brine</b></a>
        <div class="kofi">
          <a href="https://ko-fi.com/brine">
            <img src="/images/kofi.png" class="dim" title="buy me a coffee...">
          </a>
        </div>
      </div>
    </footer>
  </main>
</div>

<script>
document.querySelector('[data-copy]')?.addEventListener('click', () => {
  const text = [...document.querySelectorAll('.copyToClipboard')].map(el => el.textContent.trim()).join('\\n')
  navigator.clipboard.writeText(text).catch(console.error)
})
</script>
</body>
</html>`
}

export const handleRandoRoute = () => new Response(renderPage(), {
  headers: { 'Content-Type': 'text/html;charset=UTF-8', 'Cache-Control': 'no-store' }
})
