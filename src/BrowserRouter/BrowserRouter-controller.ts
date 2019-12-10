import { useFinalAttribute } from '@manzano/component-utils'
import { TBrowserRouterProps } from './BrowserRouter-types'
import { createBrowserHistory } from 'history'

export function useController(props: TBrowserRouterProps) {
  const {
    basename,
    forceRefresh,
    getUserConfirmation,
    keyLength,
    children,
    baseModalOptions,
    cancellation,
    onRouteNotFound,
    onAccessDenied,
    dataResolvingArg,
    modalComponent,
    accessArg,
    hasAccessInheritance,
    defaultHasAccess,
    routes,
    modalHistoryUserConfirmation
  } = props

  const history = useFinalAttribute(() => {
    return createBrowserHistory({
      basename,
      forceRefresh,
      getUserConfirmation,
      keyLength
    })
  })

  return {
    history,
    children,
    baseModalOptions,
    cancellation,
    onRouteNotFound,
    onAccessDenied,
    dataResolvingArg,
    modalComponent,
    accessArg,
    hasAccessInheritance,
    defaultHasAccess,
    routes,
    modalHistoryUserConfirmation
  }
}
