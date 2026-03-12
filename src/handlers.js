import { renderErrorPage, renderRando } from './ui.js'

export const ROUTES = {
  HOME: ''
}

const getRouteParams = () => {
  const [route, query] = location.hash.split('?')
  const params = new URLSearchParams(query)
  return { route, params }
}

const routeHandlers = {
  [ROUTES.HOME]: async () => {
    await renderRando()
  },
  default: () => {
    renderErrorPage()
  }
}

export function handleRouting () {
  const { route, params } = getRouteParams()
  console.log(route, params)
  const handler = routeHandlers[route] || routeHandlers.default
  handler({ params })
}
