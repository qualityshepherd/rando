import { handleRouting } from './handlers.js'
import { renderRando } from './ui.js'

function setEventListeners () {
  window.addEventListener('hashchange', handleRouting)
  document.querySelector('main').addEventListener('click', async (e) => {
    if (e.target.closest('.dice')) {
      e.preventDefault()
      await renderRando()
    }
  })
}

setEventListeners()
if (!document.querySelector('main').children.length) handleRouting()
