import rando from './views/rando.js'
import error from './views/error.js'

/**
 * To add pages:
 * 1. import your page/view/whatever
 * 2. add the hash and page to the routes object
 * 3. profit
 */
const routes = {
  '#rando': rando,
  '#error': error
}

/**
 * grab the hash, call the route and stuff it into the dom!
 */
const router = async () => {
  const { hash, params } = await getHash()
  document.querySelector('main').innerHTML = await routes[hash].render(params)
}

/**
 * grabs the hash and handles defaults/errors
 * @return {obj}
 */
const getHash = async () => {
  let [hash, params] = await location.hash.split('?')
  params = new URLSearchParams(params) // need this semi!

  if (hash === '' || hash === '/') {
    hash = '#rando'
  }

  if (!routes[hash]) {
    hash = '#error'
  }
  return { hash, params }
}

// and we're listening...
window.addEventListener('hashchange', router)
window.addEventListener('load', router)
