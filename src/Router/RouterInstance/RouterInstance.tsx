import React from 'react'
import { IRouterInstanceProps } from './RouterInstance-types'
import { useController } from './RouterInstance-controller'
import { HistoryProvider } from '../../HistoryContext'
import { RouteProvider } from '../../RouteStateContext'
import { ReloadRouteProvider } from '../../ReloadRouteContext'

export function RouterInstance(props: IRouterInstanceProps) {
  const { history, route, reloadRoute, children } = useController(props)

  return (
    <HistoryProvider value={history}>
      <ReloadRouteProvider value={reloadRoute}>
        <RouteProvider value={route}>{children}</RouteProvider>
      </ReloadRouteProvider>
    </HistoryProvider>
  )
}
