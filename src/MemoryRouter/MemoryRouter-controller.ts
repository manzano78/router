import { useFinalAttribute } from '@manzano/component-utils'
import { TMemoryRouterProps } from './MemoryRouter-types'
import { createMemoryHistory } from 'history'

export function useController(props: TMemoryRouterProps) {
  const {
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
    modalHistoryUserConfirmation,
    initialEntries,
    initialIndex,
    keyLength
  } = props

  const history = useFinalAttribute(() => {
    return createMemoryHistory({
      initialEntries,
      initialIndex,
      keyLength,
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
