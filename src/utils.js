// Note: fetch is provided in the browser...

export async function getJsonData (path) {
  const data = await fetch(path)
  return await data.json()
}

export function d6 (numDie = 1) {
  let result = 0
  for (let i = 0; i < numDie; i++) {
    result += Math.floor(Math.random() * 6 + 1)
  }
  return result
}

export function getRandom (array) {
  const r = Math.floor(Math.random() * array.length)
  return array[r]
}

export async function events () {
  const events = await getJsonData('./src/data/events.json')
  return [getRandom(events.verb), getRandom(events.adjective), getRandom(events.noun)]
}

export async function herb () {
  const herbs = await getJsonData('./src/data/herbs.json')
  return getRandom(herbs)
}

export async function names () {
  const names = await getJsonData('./src/data/npc.json')
  return [getRandom(names.male), getRandom(names.female), getRandom(names.they), getRandom(names.sur)]
}

export async function monikers () {
  const names = await getJsonData('./src/data/npc.json')
  return [getRandom(names.role), getRandom(names.epithet), getRandom(names.trait), getRandom(names.relationship), getRandom(names.belief)]
}

export async function tarotCard () {
  const tarot = await getJsonData('./src/data/tarot.json')
  return getRandom(tarot)
}

export async function hook () {
  const hooks = await getJsonData('./src/data/hooks.json')
  return getRandom(hooks)
}

export async function misc () {
  const misc = await getJsonData('./src/data/misc.json')
  return [getRandom(misc.villageItem), getRandom(misc.dungeonItem), getRandom(misc.architectureFeature), getRandom(misc.complication)]
}

export async function loot () {
  const loot = await getJsonData('./src/data/loot.json')
  const lootType = await getRandom(loot.type)
  return [`${getRandom(loot.container)} that contains ${getRandom(loot.potion_adjective)},
         ${getRandom(loot.color)} liquid that ${getRandom(loot.taste)} and when consumed ${getRandom(loot.effect)}`,
         `${getRandom(loot.size)} <a href="https://www.google.com/search?as_st=y&tbm=isch&as_q=${lootType}" target="new"><b>${lootType}</b></a>
         ${getRandom(loot.quality)}.`, getRandom(loot.magicItem)]
}

export async function weather () {
  // because d6() is NOT zero based...
  const weather = [d6(), 'rain/fog/snow', 'storm', 'wind', 'hot/cold', 'clouds', 'sun']
  const severity = [d6(), 'epic', 'severe', 'harsh', 'moderate ', 'mild', 'wonderful']
  // yeah, I know... but I wanted to retain the number too...
  return [severity[severity[0]], weather[weather[0]], `./assets/images/weather/${weather[0]}.svg`]
}

export async function yesOrNo () {
  return (d6() > 3) ? 'Yes' : 'No'
}

export async function arrow () {
  return `./assets/images/arrow/${d6()}.svg`
}

export function sortBy (prop) {
  return (a, b) => {
    return (a[prop] > b[prop]) ? 1 : (a[prop] < b[prop]) ? -1 : 0
  }
}
