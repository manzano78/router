import React from 'react'
import { Router } from '../Router'
import { THashRouterProps } from './HashRouter-types'
import { useController } from './HashRouter-controller'

export function HashRouter(props: THashRouterProps) {
  const {
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
    history
  } = useController(props)

  return (
    <Router
      history={history}
      routes={routes}
      baseModalOptions={baseModalOptions}
      accessArg={accessArg}
      onAccessDenied={onAccessDenied}
      onRouteNotFound={onRouteNotFound}
      dataResolvingArg={dataResolvingArg}
      cancellation={cancellation}
      defaultHasAccess={defaultHasAccess}
      hasAccessInheritance={hasAccessInheritance}
      modalComponent={modalComponent}
      modalHistoryUserConfirmation={modalHistoryUserConfirmation}
    >
      {children}
    </Router>
  )
}
