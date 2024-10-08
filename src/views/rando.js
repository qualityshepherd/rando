import * as r from '../utils'

const rando = {
  async render (params) {
    const [male, female, they, sur] = await r.names()
    const [role, epithet, trait, relationship, belief] = await r.epithets()
    const card = await r.tarotCard()
    const [villageItem, dungeonItem, complication, threat, pocket, trade] = await r.misc()
    const [severity, weather, iconUrl] = await r.weather()
    const [potion, loot, magicItem] = await r.loot()

    return `
      <right>
        <dice>
          <a onclick="location.reload()" title="refresh...">
          <img src="./assets/images/dice/${r.d6()}.svg" class="dim" title="click to re-roll" />
          <img src="./assets/images/dice/${r.d6()}.svg" class="dim" title="click to re-roll" />
          <img src="./assets/images/dice/${r.d6()}.svg" class="dim" title="click to re-roll" />
          </a>
        </dice>
        <tarot>
          <div><img src="${card.url}" class="dim ${card.reversed ? 'reversed' : 'upright'}" alt="${card.name}" title="${card.name} ${card.reversed ? 'reversed' : 'upright'}" /></div>
          <div class="description small">${card.reversed ? card.desc_reversed : card.desc_upright}</div>
        </tarot>
        <symbols>
          <img src="${iconUrl}" alt="${weather}" class="dim" title="${weather}" />
          <div class="small">${severity} ${weather}</div>
          <img src="${await r.arrow()}" class="dim" title="direction or hit location" />
          <div class="header dim" title="ask a question">${await r.yesNoAndBut()}</div>
        </symbols>
      </right>

      <left>
        <div class="npc">
          <div class="name header">[${male}, ${female}, ${they}] ${sur}</div>
          <div class="italic">${role}, ${epithet}, ${trait}${relationship ? `, ${relationship}` : '' }</div>
          <div class="belief"><label>Belief</label> ${belief}</div>
        <div>

        <div class="sparks header">Sparks <span class="copy dim small" title="copy text" onclick="copyTextToClipboard()">✁</span></div>
          <div class="copyToClipboard"><label>Sparks</label> ${await r.sparks()}</div>
          <div class="copyToClipboard"><label>Threat</label> ${threat}</div>
          <div class="copyToClipboard"><label>Complication</label> ${complication}</div>

        <div class="loot header">Loot</div>
          <label>Loot</label> ${(r.d6() * r.d6() + r.d6())} coins and ${loot} </div>
          <div><label>Apothecary</label> ${await r.apothecary()}</div>
          <div><label>Found</label> ${villageItem}, ${dungeonItem}</div>
          <div><label>Pocket</label> ${pocket}</div>
          <div><label>Trade</label> ${trade}</div>
          <div><label>Magic</label> ${magicItem}</div>
          <div><label>Potion</label> ${potion}</div>

        <div class="situation header">Situation</div>
          <div>${await r.situation()}<d/iv>
        </div>
      </left>

      <footer>
        <div class="dim">
          <b>RANDO</b> is a random generator for running TTRPGs
          <br>by <a href="https://brine.dev"><b>brine</b></a>
        </div>
      </footer>
    `
  }
}
export default rando
