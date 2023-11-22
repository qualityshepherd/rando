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

export async function spark () {
  const spark = await getJsonData('./src/data/spark.json')
  return [getRandom(spark.verb), getRandom(spark.adjective), getRandom(spark.noun)]
}

export async function apothecary () {
  const apothecary = await getJsonData('./src/data/apothecary.json')
  return getRandom(apothecary)
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
  const card = await getRandom(await getJsonData('./src/data/tarot.json'))
  if(d6() < 3) {
    card.reversed = true
  }
  return card
}

export async function situation () {
  const situation = await getJsonData('./src/data/situation.json')
  return getRandom(situation)
}

export async function misc () {
  const misc = await getJsonData('./src/data/misc.json')
  return [getRandom(misc.villageItem), getRandom(misc.dungeonItem), getRandom(misc.dungeonFeature), getRandom(misc.ruinFeature), getRandom(misc.complication)]
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
