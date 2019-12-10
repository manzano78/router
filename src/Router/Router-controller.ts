import { useFinalAttribute } from '@manzano/component-utils'
import { IRouterProps } from './Router-types'
import { toRouteConfigMatchers } from './Router-utils'

export function useController(props: IRouterProps) {
  const { children, baseModalOptions, modalComponent: ModalComponent } = props

  const {
    accessArg,
    hasAccessInheritance,
    defaultHasAccess,
    onAccessDenied,
    onRouteNotFound,
    routes,
    modalHistoryUserConfirmation,
    dataResolvingArg,
    mainHistory,
    cancellation
  } = useFinalAttribute(() => {
    const {
      accessArg,
      modalHistoryUserConfirmation,
      dataResolvingArg,
      cancellation,
      history: mainHistory,
      routes: routeConfigs,
      defaultHasAccess,
      hasAccessInheritance,
      onRouteNotFound,
      onAccessDenied
    } = props

    const routes = toRouteConfigMatchers(routeConfigs)

    return {
      accessArg,
      modalHistoryUserConfirmation,
      dataResolvingArg,
      cancellation,
      mainHistory,
      routes,
      defaultHasAccess,
      hasAccessInheritance,
      onRouteNotFound,
      onAccessDenied
    }
  })

  return {
    accessArg,
    modalHistoryUserConfirmation,
    dataResolvingArg,
    children,
    baseModalOptions,
    cancellation,
    mainHistory,
    ModalComponent,
    defaultHasAccess,
    hasAccessInheritance,
    onRouteNotFound,
    onAccessDenied,
    routes
  }
}
