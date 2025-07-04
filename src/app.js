import { handleRouting } from './handlers.js'

function setEventListeners () {
  window.addEventListener('hashchange', handleRouting)
}

setEventListeners()
handleRouting()
