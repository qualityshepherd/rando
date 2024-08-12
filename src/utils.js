// Note: fetch is provided in the browser...

// eslint-disable-next-line no-extend-native
Array.prototype.random = function () {
  return this[Math.floor((Math.random() * this.length))]
}

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

export async function sparks () {
  const data = await getJsonData('./src/data/sparks.json')
  let randSparks = []
  while (randSparks.length < 4) {
    randSparks.push(data.random())
    // eslint-disable-next-line no-new
    randSparks = [...new Set(randSparks)] // removes dupes
  }
  return randSparks.join(', ')
}

export async function apothecary () {
  const apothecary = await getJsonData('./src/data/apothecary.json')
  return apothecary.random()
}

export async function names () {
  const names = await getJsonData('./src/data/npc.json')
  return [names.male.random(), names.female.random(), names.they.random(), names.sur.random()]
}

export async function epithets () {
  const names = await getJsonData('./src/data/npc.json')
  return [names.role.random(), names.epithet.random(), names.trait.random(), names.relationship.random(), names.belief.random()]
}

export async function tarotCard () {
  const card = (await getJsonData('./src/data/tarot.json')).random()
  if (d6() < 3) {
    card.reversed = true
  }
  return card
}

export async function situation () {
  const situation = await getJsonData('./src/data/situation.json')
  return situation.random()
}

export async function misc () {
  const misc = await getJsonData('./src/data/misc.json')
  return [misc.villageItem.random(), misc.dungeonItem.random(), misc.complication.random(), misc.threat.random(), misc.pocket.random(), misc.trade.random()]
}

export async function loot () {
  const loot = await getJsonData('./src/data/loot.json')
  const lootType = loot.type.random()
  return [`${loot.potion_adjective.random()},
         ${loot.color.random()} liquid that ${loot.taste.random()} that makes the target <i>${loot.effect.random()}</i>`,
         `${lootType}`, loot.magicItem.random()]
}

export async function weather () {
  // because d6() is NOT zero based...
  const weather = [d6(), 'rain/fog/snow', 'storm', 'wind', 'hot/cold', 'clouds', 'sun']
  const severity = [d6(), 'epic', 'severe', 'harsh', 'moderate ', 'mild', 'wonderful']
  // yeah, I know... but I wanted to retain the number too...
  return [severity[severity[0]], weather[weather[0]], `./assets/images/weather/${weather[0]}.svg`]
}

export async function yesNoAndBut () {
  switch (d6()) {
    case 6: return 'Yes+'
    case 5: return 'Yes'
    case 4: return 'Yes?'
    case 3: return 'No?'
    case 2: return 'No'
    case 1: return 'No+'
  }
}

export async function arrow () {
  return `./assets/images/arrow/${d6()}.svg`
}

export function sortBy (prop) {
  return (a, b) => {
    return (a[prop] > b[prop]) ? 1 : (a[prop] < b[prop]) ? -1 : 0
  }
}
