// We use getters so DOM access is lazy — the actual query happens only when you
// access the property and doesn’t trigger DOM access.
export const elements = {
  main: document.querySelector('main'),
  get copyButton () {
    return document.querySelector('[data-copy]')
  },
  get rerollButton () {
    return document.querySelector('.dice')
  }
}
