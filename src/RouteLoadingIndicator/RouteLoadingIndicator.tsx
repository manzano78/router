import React, { Suspense } from 'react'
import { IRouteLoadingIndicatorProps } from './RouteLoadingIndicator-types'
import { ErrorBoundary } from '@manzano/error-boundary'
import { useController } from './RouteLoadingIndicator-controller'
import { FallbackContainer } from './FallbackContainer'

export function RouteLoadingIndicator(props: IRouteLoadingIndicatorProps) {
  const { loadingIndicator, fallback } = useController(props)

  return (
    <ErrorBoundary fallback={fallback}>
      <Suspense fallback={loadingIndicator}>
        <FallbackContainer>{fallback}</FallbackContainer>
      </Suspense>
    </ErrorBoundary>
  )
}
