import { IDisplayableRouteState, IRouteObserver } from '../types'
import { createValueObserver } from '../utils'

export function createRouteObserver(): IRouteObserver {
  const {
    getValue: getRouteState,
    setValue: setRouteState,
    listen: listenToRouteState
  } = createValueObserver<IDisplayableRouteState>({
    error: null,
    currentRoute: null,
    isLoadingNextRoute: true,
  })

  return { getRouteState, setRouteState, listenToRouteState }
}
