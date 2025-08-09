import * as r from './utils.js'

export async function randoTemplate () {
  const [
    [male, female, they, sur],
    [role, epithet, trait, relationship, belief],
    card,
    [villageItem, dungeonItem, complication, threat, pocket, trade],
    [severity, weather, iconUrl],
    [potion, loot, magicItem],
    arrow,
    yesNoAndBut,
    sparks,
    apothecary,
    situation
  ] = await Promise.all([
    r.names(),
    r.epithets(),
    r.tarotCard(),
    r.misc(),
    r.weather(),
    r.loot(),
    r.arrow(),
    r.yesNoAndBut(),
    r.sparks(),
    r.apothecary(),
    r.situation()
  ])

  const coinAmount = r.d6() * r.d6() + r.d6()

  return `
    <right>
      ${diceSection()}
      ${tarotSection(card)}
      ${symbolsSection({ iconUrl, weather, severity, arrow, yesNoAndBut })}
    </right>

    <left>
      ${npcSection({ male, female, they, sur, role, epithet, trait, relationship, belief })}
      ${sparksSection(sparks, threat, complication)}
      ${lootSection({ coinAmount, loot, apothecary, potion, magicItem, villageItem, dungeonItem, pocket, trade })}
      ${situationSection(situation)}
    </left>

    ${footerSection()}
  `
}

//
// sections...
//
function diceSection() {
  return `
    <dice>
      <a class="reroll" title="refresh...">
        ${[...Array(3)].map(() =>
          `<img src="./assets/images/dice/${r.d6()}.svg" class="dim" title="click to re-roll" />`
        ).join('')}
      </a>
    </dice>`
}

function tarotSection(card) {
  const orientation = card.reversed ? 'reversed' : 'upright'
  const description = card.reversed ? card.desc_reversed : card.desc_upright
  return `
    <tarot>
      <div><img src="${card.url}" class="dim ${orientation}" alt="${card.name}" title="${card.name} ${orientation}" /></div>
      <div class="description small">${description}</div>
      <p style="display: none;" class="copyToClipboard"><label>Tarot</label> ${card.name} ${orientation} - ${description}</p>
    </tarot>`
}

function symbolsSection({ iconUrl, weather, severity, arrow, yesNoAndBut }) {
  return `
    <symbols>
      <img src="${iconUrl}" alt="${weather}" class="dim" title="${weather}" />
      <div class="small">${severity} ${weather}</div>
      <img src="${arrow}" class="dim" title="direction or hit location" />
      <div class="header dim" title="ask a question">${yesNoAndBut}</div>
    </symbols>`
}

function npcSection({ male, female, they, sur, role, epithet, trait, relationship, belief }) {
  return `
    <div class="npc">
      <div class="name header">[${male}, ${female}, ${they}] ${sur}</div>
      <div class="italic">${role}, ${epithet}, ${trait}${relationship ? `, ${relationship}` : ''}</div>
      <div class="belief"><label>Belief</label> ${belief}</div>
    </div>`
}

function sparksSection(sparks, threat, complication) {
  return `
    <div class="sparks header">Sparks <span class="copy dim small" title="copy sparks and tarot text" data-copy>✁</span></div>
    <div class="copyToClipboard"><label>Sparks</label> ${sparks}</div>
    <div class="copyToClipboard"><label>Threat</label> ${threat}</div>
    <div class="copyToClipboard"><label>Complication</label> ${complication}</div>`
}

function lootSection({ coinAmount, loot, apothecary, potion, magicItem, villageItem, dungeonItem, pocket, trade }) {
  return `
    <div class="loot header">Loot</div>
    <div><label>Loot</label> ${coinAmount} coins and ${loot}</div>
    <div><label>Apothecary</label> ${apothecary}</div>
    <div><label>Found</label> ${villageItem}, ${dungeonItem}</div>
    <div><label>Pocket</label> ${pocket}</div>
    <div><label>Trade</label> ${trade}</div>
    <div><label>Magic</label> ${magicItem}</div>
    <div><label>Potion</label> ${potion}</div>`
}

function situationSection(situation) {
  return `
    <div class="situation header">Situation</div>
    <div>${situation}</div>`
}

function footerSection() {
  return `
    <footer>
      <div class="dim">
        <b>RANDO</b> is a random generator for running TTRPGs
        <br>by <a href="https://brine.dev"><b>brine</b></a>
        <div class="kofi">
          <a href="https://ko-fi.com/brine">
            <img src="./assets/images/kofi.png" class="dim" title="buy me a coffee...">
          </a>
        </div>
      </div>
    </footer>`
}

export const errorTemplate = () => '<h2>404 Not Found...</h2>'
