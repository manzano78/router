import { IRouterOptions, TCancel, TRouter, TStopRouter } from '../types'
import { Location } from 'history'
import { loadRoute } from './routeLoader'
import { createRef, MutableRefObject } from 'react'

const routerStoppers = new Map<TRouter, TStopRouter>()

export function startRouter(
  router: TRouter,
  routerOptions: IRouterOptions
) {
  if (!routerStoppers.has(router)) {
    const { history, setRouteState, } = router
    const cancelRef = createRef<TCancel>() as MutableRefObject<TCancel>
    const loadNextRouteFromLocation = (location: Location) => {
      const { current: cancel } = cancelRef

      if (cancel) {
        cancel()
      }

      loadRoute(location, setRouteState, routerOptions, cancelRef)
    }

    const stopRouter = history.listen(loadNextRouteFromLocation)

    loadNextRouteFromLocation(history.location)

    routerStoppers.set(router, stopRouter)
  }
}

export function stopRouter(router: TRouter) {
  const stopRouter = routerStoppers.get(router)

  if (stopRouter) {
    stopRouter()

    routerStoppers.delete(router)
  }
}
