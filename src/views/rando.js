import * as r from '../utils'

const rando = {
  async render (params) {
    const [male, female, they, sur] = await r.names()
    const [verb, adjective, noun] = await r.events()
    const [role, history, trait, relationship, belief] = await r.monikers()
    const card = await r.tarotCard()
    const [villageItem, dungeonItem, architectureFeature, complication] = await r.misc()
    const [severity, weather, iconUrl] = await r.weather()

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
          <div class="header dim">${await r.yesOrNo()}</div>
        </symbols>
      </right>

      <left>
        <div class="npc">
          <div class="name header">[${male}, ${female}, ${they}] ${sur}</div>
          <div class="italic">${role}, ${history}, ${trait}, ${relationship}</div>
          <div class="belief"><label>Belief</label> ${belief}</div>
        <div>

        <div class="scene header">Scene</div>
          <div>${await r.scene()}<d/iv>
          <div class="small spark">${verb}, ${adjective}, ${noun}</div>
        </div>

        <div class="misc header">Misc</div>
          <ul>
            <li><label>Items</label> ${villageItem}, ${dungeonItem}</li>
            <li><label>Feature</label> <a href="https://www.google.com/search?as_st=y&tbm=isch&as_q=${architectureFeature}" target="new">${architectureFeature}</a></li>
            <li><label>Complication</label> ${complication}</li>
          </ul>

        <div class="loot header">Loot</div>
          <ul>
            <li>${await r.loot()}</li>
            <li><label>Herb</label> ${await r.herb()}</li>
            <li><label>Potion</label> ${await r.potion()}</li>
          </ul>
      </left>
    `
  }
}
export default rando
