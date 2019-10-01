import {
  IRouteParams} from './types'
import { isFunction, isString } from 'ts-util-is'
import { Path } from 'history'
import { createRouteError } from './createRouteError'
import {
  IBreacrumbItem,
  IErrorSuggestingFallbackView,
  IErrorSuggestingRedirection, IMatch, IParentRoute, IRouteConfigMatcher,
  IRouteError,
  TBreadcrumb, TData, TFallback, TGetFallback, TMetaConfig, TRouteAsyncDataConfig
} from './types'
import { Observable } from 'rxjs'

export function getRouteAsyncData(
  routeAsyncData: TRouteAsyncDataConfig | undefined,
  params: IRouteParams,
  dataResolvingArg: any,
  cancelSignal: any
) {
  const routeData =
    routeAsyncData && routeAsyncData(params, dataResolvingArg, cancelSignal)

  return routeData != null && routeData instanceof Promise
    ? routeData
    : undefined
}

export function toMetaData(
  params: IRouteParams,
  metaConfig: TMetaConfig = {},
  routeData: TData
) {
  const result = isFunction(metaConfig)
    ? metaConfig(params, routeData)
    : metaConfig

  return result || {}
}

export function listenToObservable<T>(
  observable: Observable<T>,
  listener: (value: T) => void
) {
  const subscription = observable.subscribe({ next: listener })

  return () => {
    subscription.unsubscribe()
  }
}

export function hasAnyPromiseToResolve(items: any[]) {
  return items.some((item) => {
    return item instanceof Promise
  })
}

export function isRouteError(
  error: any
): error is IErrorSuggestingRedirection | IErrorSuggestingFallbackView {
  return (error as IRouteError).isRouteError
}

export function isRouteErrorSuggestingRedirection(
  error: IErrorSuggestingFallbackView | IErrorSuggestingRedirection
): error is IErrorSuggestingRedirection {
  return isString((error as IErrorSuggestingRedirection).redirection)
}

export function toBreadcrumb(
  match: IMatch,
  dataResolvingArg: any,
  cancelSignal: any,
  dataPromise?: Promise<TData>
): TBreadcrumb | Promise<TBreadcrumb> {
  const breadcrumbItems: Array<IBreacrumbItem | Promise<IBreacrumbItem>> = []

  fillBreadcrumb(
    match,
    match.params,
    dataResolvingArg,
    cancelSignal,
    dataPromise,
    breadcrumbItems
  )

  return hasAnyPromiseToResolve(breadcrumbItems)
    ? Promise.all(breadcrumbItems)
    : (breadcrumbItems as TBreadcrumb)
}

export function fillBreadcrumb(
  resource: IMatch | IParentRoute,
  params: IRouteParams,
  dataResolvingArg: any,
  cancelSignal: any,
  dataPromise: Promise<TData> | undefined,
  breadcrumb: Array<IBreacrumbItem | Promise<IBreacrumbItem>>,
  isLast = true
) {
  if (resource.parent) {
    fillBreadcrumb(
      resource.parent,
      params,
      dataResolvingArg,
      cancelSignal,
      dataPromise,
      breadcrumb,
      false
    )
  }

  const { path, breadcrumbItemData } = resource
  const data = isFunction(breadcrumbItemData)
    ? breadcrumbItemData(params, dataResolvingArg, cancelSignal, dataPromise)
    : breadcrumbItemData

  if (data instanceof Promise) {
    const breadcrumbItem = data.then((data) => ({ isLast, path, data }))

    breadcrumb.push(breadcrumbItem)
  } else {
    breadcrumb.push({ isLast, path, data })
  }
}

export function assertMatchExistence(
  match: IMatch | null,
  onRouteNotFound: TFallback | TGetFallback,
  reloadFully: () => void
) {
  if (!match) {
    throw createRouteError(onRouteNotFound, reloadFully)
  }
}

export function assertHasAccess(
  resource: IMatch | IParentRoute,
  accessArg: any,
  defaultHasAccess: boolean,
  hasAccessInheritance: boolean,
  onAccessDenied: TFallback | TGetFallback,
  reload: () => void,
  reloadFully: () => void
) {
  let hasAccess: boolean

  if (hasAccessInheritance && resource.parent) {
    assertHasAccess(
      resource.parent,
      accessArg,
      defaultHasAccess,
      hasAccessInheritance,
      onAccessDenied,
      reload,
      reloadFully
    )

    hasAccess = !resource.hasAccess || resource.hasAccess(accessArg)
  } else {
    hasAccess = resource.hasAccess
      ? resource.hasAccess(accessArg)
      : defaultHasAccess
  }

  if (!hasAccess) {
    throw createRouteError(onAccessDenied, reloadFully, reload)
  }
}

export function searchMatch(
  path: Path,
  routeConfigs: IRouteConfigMatcher[],
  parent?: IParentRoute
): IMatch | null {
  for (const routeConfig of routeConfigs) {
    const {
      meta,
      route,
      component,
      hasAccess,
      subRoutes,
      routeAsyncData,
      breadcrumbItemData
    } = routeConfig
    const params = route.match(path)

    if (params) {
      return {
        params,
        component,
        routeAsyncData,
        hasAccess,
        meta,
        path,
        parent
      }
    }

    if (subRoutes) {
      const parentRoute: IParentRoute = {
        path: '',
        breadcrumbItemData,
        hasAccess,
        parent
      }

      const match = searchMatch(path, subRoutes, parentRoute)

      if (match) {
        parentRoute.path = route.reverse(match.params) as string

        return match
      }
    }
  }

  return null
}
