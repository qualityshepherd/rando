import * as r from '../utils'

const rando = {
  async render (params) {
    const [male, female, they, sur] = await r.names()
    const [verb, adjective, noun] = await r.events()
    const [role, epithet, trait, relationship, belief] = await r.monikers()
    const card = await r.tarotCard()
    const [villageItem, dungeonItem, architectureFeature, complication] = await r.misc()
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
          <div><img src="${card.url}" class="dim" alt="${card.name}" title="${card.name}" /></div>
          <div class="description small">${card.description}</div>
        </tarot>
        <symbols>
          <img src="${iconUrl}" alt="${weather}" class="dim" title="${weather}" />
          <div class="small">${severity} ${weather}</div>
          <img src="${await r.arrow()}" class="dim" title="direction or hit location" />
          <div class="header dim" title="ask a question">${await r.yesOrNo()}</div>
        </symbols>
      </right>

      <left>
        <div class="npc">
          <div class="name header">[${male}, ${female}, ${they}] ${sur}</div>
          <div class="italic">${role}, ${epithet}, ${trait}, ${relationship}</div>
          <div class="belief"><label>Belief</label> ${belief}</div>
        <div>

        <div class="situation header">Situation</div>
          <div>${await r.situation()}<d/iv>
        </div>

        <div class="misc header">Misc</div>
          <div><label>Spark</label>${verb}, ${adjective}, ${noun}</div>
          <div><label>Items</label> ${villageItem}, ${dungeonItem}</div>
          <div><label>Feature</label> <a href="https://www.google.com/search?as_st=y&tbm=isch&as_q=${architectureFeature}" target="new">${architectureFeature}</a></div>
          <div><label>Complication</label> ${complication}</div>

        <div class="loot header">Loot</div>
          <div><label>Coin</label> ${(r.d6() * r.d6() + r.d6())}</div>
          <div><label>Loot</label> ${loot}</div>
          <div><label>Apothecary</label> ${await r.apothecary()}</div>
          <div><label>Magic</label> ${magicItem}</div>
          <div><label>Potion</label> ${potion}</div>
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
