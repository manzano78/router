import { THashRouterProps } from './HashRouter-types'
import { createHashHistory } from 'history'
import { useFinalAttribute } from '@manzano/component-utils'

export function useController(props: THashRouterProps) {
  const {
    basename,
    hashType,
    getUserConfirmation,
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
    return createHashHistory({
      basename,
      hashType,
      getUserConfirmation
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
