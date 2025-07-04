import { elements } from './dom.js'
import { errorTemplate, randoTemplate } from './templates.js'

export async function renderRando () {
  elements.main.innerHTML = await randoTemplate()
  setupInteractions()
}

export function renderErrorPage () {
  elements.main.innerHTML = errorTemplate()
}

function setupInteractions () {
  const reroll = elements.rerollButton
  reroll?.addEventListener('click', () => location.reload())

  const copy = elements.copyButton
  copy?.addEventListener('click', () => {
    const text = [...document.querySelectorAll('.copyToClipboard')]
      .map(el => el.textContent.trim())
      .join('\n')

    navigator.clipboard.writeText(text).catch(console.error)
  })
}
