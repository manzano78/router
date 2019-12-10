import {
  isDisplayableMatch,
  isDisplayableRouteConfig
} from './RouterInstance-utils'
import { PENDING, REJECTED, RESOLVED } from './RouterInstance-constants'
import {
  TMatch,
  IParentRoute,
  IRouterInstanceProps,
  TFallback,
  TRouteAsyncDataConfig,
  IDisplayableMatch,
  IRedirectionMatch,
  TDataEntry,
  TGetFallback
} from './RouterInstance-types'
import { useEffect, useState } from 'react'
import {
  createLocation,
  createPath,
  Location,
  LocationDescriptor,
  Path
} from 'history'
import { isFunction } from 'ts-util-is'
import { DefaultRouteNotFoundView } from './DefaultRouteNotFoundView'
import { DefaultAccessDeniedView } from './DefaultAccessDeniedView'
import { isDefaultRedirectionFallback, toParent } from './RouterInstance-utils'
import { useFinalAttribute, useFinalCallback } from '@manzano/component-utils'
import { IRoute, IRouteParams, TBreadcrumb } from '../../RouteStateContext'

export function useController(props: IRouterInstanceProps) {
  const { children } = props
  const {
    onRouteNotFound,
    onAccessDenied,
    history,
    cancellation,
    topLevelRouteConfigs,
    dataResolvingArg,
    defaultHasAccess,
    hasAccessInheritance,
    accessArg
  } = useFinalAttribute(() => {
    const {
      accessArg,
      dataResolvingArg,
      cancellation,
      history,
      routes: topLevelRouteConfigs,
      defaultHasAccess = false,
      hasAccessInheritance = true,
      onRouteNotFound = { display: DefaultRouteNotFoundView },
      onAccessDenied = { display: DefaultAccessDeniedView }
    } = props

    return {
      accessArg,
      dataResolvingArg,
      cancellation,
      history,
      defaultHasAccess,
      hasAccessInheritance,
      onRouteNotFound,
      onAccessDenied,
      topLevelRouteConfigs
    }
  })
  const [route, setRoute] = useState(
    (): IRoute => ({
      params: {},
      breadcrumb: [],
      component: () => null
    })
  )

  const cancelRouteLoading = () => {
    if (cancellation) {
      cancellation.cancel()
    }
  }

  const handleRouteRedirection = (
    redirectionMatch: IRedirectionMatch,
    currentLocation: Location
  ) => {
    const { redirectTo, params } = redirectionMatch
    const targetLocationDescriptor = isFunction(redirectTo)
      ? redirectTo(currentLocation, params)
      : redirectTo

    executeRedirection(targetLocationDescriptor, currentLocation)
  }

  const executeRedirection = (
    targetLocationDescriptor: LocationDescriptor,
    currentLocation: Location
  ) => {
    const targetLocation = createLocation(
      targetLocationDescriptor,
      currentLocation.state,
      undefined,
      currentLocation
    )

    history.replace(targetLocation)
  }

  const searchMatch = (
    path: Path,
    routeConfigs = topLevelRouteConfigs,
    getParent?: (params: IRouteParams) => IParentRoute
  ): TMatch | undefined => {
    for (const routeConfig of routeConfigs) {
      const {
        route,
        subRoutes,
        breadcrumbItemData,
        breadcrumbItemComponent,
        hasAccess
      } = routeConfig
      const params = route.match(path)

      if (params) {
        const parent = toParent(params, getParent)

        if (isDisplayableRouteConfig(routeConfig)) {
          const {
            meta,
            component,
            routeAsyncData,
            placeholderComponent
          } = routeConfig

          return {
            params,
            component,
            routeAsyncData,
            hasAccess,
            meta,
            path,
            placeholderComponent,
            breadcrumbItemAsyncData: breadcrumbItemData,
            breadcrumbItemComponent,
            parent
          }
        }

        const { redirectTo } = routeConfig

        return { redirectTo, params, hasAccess, parent }
      }

      if (subRoutes) {
        const match = searchMatch(path, subRoutes, (params) => ({
          hasAccess,
          breadcrumbItemAsyncData: breadcrumbItemData,
          breadcrumbItemComponent,
          path: route.reverse(params) as string,
          parent: toParent(params, getParent)
        }))

        if (match) {
          return match
        }
      }
    }

    return undefined
  }

  const hasAccess = (resource: TMatch | IParentRoute): boolean => {
    if (hasAccessInheritance && resource.parent) {
      return (
        hasAccess(resource.parent) &&
        (!resource.hasAccess || resource.hasAccess(accessArg))
      )
    }

    return resource.hasAccess ? resource.hasAccess(accessArg) : defaultHasAccess
  }

  const getCancellationSignal = () => {
    return cancellation && cancellation.getSignal()
  }

  const isRouteLoadingCancelError = (error: any) => {
    return !!cancellation?.isCancelError && cancellation.isCancelError(error)
  }

  const toBreadcrumb = (
    match: IDisplayableMatch,
    cancellationSignal: any,
    routeDataPromise?: Promise<any>
  ): TBreadcrumb => {
    const { params } = match
    const breadcrumb: TBreadcrumb = []

    fillBreadcrumb(
      match,
      params,
      cancellationSignal,
      routeDataPromise,
      breadcrumb
    )

    return breadcrumb
  }

  const fillBreadcrumb = (
    resource: IDisplayableMatch | IParentRoute,
    params: IRouteParams,
    cancellationSignal: any,
    routeDataPromise: Promise<any> | undefined,
    breadcrumb: TBreadcrumb,
    isLast = true
  ) => {
    const { breadcrumbItemComponent: component, parent } = resource

    if (parent) {
      const isParentLast = isLast && !component

      fillBreadcrumb(
        parent,
        params,
        cancellationSignal,
        routeDataPromise,
        breadcrumb,
        isParentLast
      )
    }

    if (component) {
      let readData: (() => void) | undefined
      const { path, breadcrumbItemAsyncData } = resource

      if (breadcrumbItemAsyncData) {
        const dataPromise = breadcrumbItemAsyncData(
          params,
          dataResolvingArg,
          cancellationSignal,
          routeDataPromise
        )

        readData = createDataReader(dataPromise)
      }

      breadcrumb.push({
        path,
        isLast,
        component,
        get data() {
          return readData && readData()
        }
      })
    }
  }

  const toRouteDataPromise = (
    routeAsyncDataConfig: TRouteAsyncDataConfig | undefined,
    routeParams: IRouteParams,
    cancellationSignal: any
  ) => {
    let routeDataPromise: Promise<any> | undefined

    if (routeAsyncDataConfig) {
      routeDataPromise = routeAsyncDataConfig(
        routeParams,
        dataResolvingArg,
        cancellationSignal
      )
    }

    return routeDataPromise
  }

  const updateRoute = (match: IDisplayableMatch) => {
    const {
      params,
      placeholderComponent,
      component,
      routeAsyncData,
      meta: metaConfig
    } = match
    const cancellationSignal = getCancellationSignal()
    const dataPromise = toRouteDataPromise(
      routeAsyncData,
      params,
      cancellationSignal
    )
    const readData = dataPromise && createDataReader(dataPromise)
    const breadcrumb = toBreadcrumb(match, cancellationSignal, dataPromise)
    const meta = toMeta(metaConfig, params)

    setRoute({
      params,
      placeholderComponent,
      breadcrumb,
      component,
      meta,
      get data() {
        return readData && readData()
      }
    })
  }

  const toMeta = (metaConfig: any, params: IRouteParams) => {
    return isFunction(metaConfig) ? metaConfig(params) : metaConfig
  }

  const loadRoute = useFinalCallback(() => {
    cancelRouteLoading()

    const { location } = history
    const path = createPath(location)
    const match = searchMatch(path)

    if (match) {
      if (hasAccess(match)) {
        if (isDisplayableMatch(match)) {
          updateRoute(match)
        } else {
          handleRouteRedirection(match, location)
        }
      } else {
        handleAccessDenied(location)
      }
    } else {
      handleRouteNotFound(location)
    }
  })

  const handleAccessDenied = (location: Location) => {
    handleFallback(onAccessDenied, location)
  }

  const handleRouteNotFound = (location: Location) => {
    handleFallback(onRouteNotFound, location)
  }

  const handleFallback = (
    fallback: TFallback | TGetFallback,
    location: Location
  ) => {
    const effectiveFallback = isFunction(fallback)
      ? fallback(location)
      : fallback

    if (isDefaultRedirectionFallback(effectiveFallback)) {
      executeRedirection(effectiveFallback.redirectTo, location)
    } else {
      const { display: component } = effectiveFallback

      setRoute({
        component,
        params: {},
        breadcrumb: []
      })
    }
  }

  const createDataReader = (dataPromise: Promise<any>) => {
    let dataEntry: TDataEntry = { status: PENDING }

    const promise = dataPromise.then(
      (result) => {
        dataEntry = { status: RESOLVED, result }
      },
      (error) => {
        if (!isRouteLoadingCancelError(error)) {
          dataEntry = { status: REJECTED, error }
        }
      }
    )

    return () => {
      switch (dataEntry.status) {
        case PENDING:
          throw promise
        case REJECTED:
          throw dataEntry.error
        default:
          return dataEntry.result
      }
    }
  }

  useEffect(() => {
    const stopRouter = history.listen(loadRoute)

    loadRoute()

    return () => {
      stopRouter()
      cancelRouteLoading()
    }
  }, [])

  return { history, reloadRoute: loadRoute, route, children }
}
