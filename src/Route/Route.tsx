import React, { Suspense } from 'react'
import { useController } from './Route-controller'
import { IRouteProps } from './Route-types'
import { ErrorBoundary } from '@manzano/error-boundary'

export function Route(props: IRouteProps) {
  const {
    defaultPlaceholder,
    errorFallback,
    routeViewKey,
    PlaceholderComponent,
    RouteView
  } = useController(props)

  const placeholder = PlaceholderComponent ? (
    <PlaceholderComponent />
  ) : (
    defaultPlaceholder
  )

  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={placeholder}>
        <RouteView key={routeViewKey} />
      </Suspense>
    </ErrorBoundary>
  )
}
