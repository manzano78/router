import React from 'react'
import { Router } from '../Router'
import { TBrowserRouterProps } from './BrowserRouter-types'
import { useController } from './BrowserRouter-controller'

export function BrowserRouter(props: TBrowserRouterProps) {
  const {
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
