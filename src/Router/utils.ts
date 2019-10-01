import { IMainRouter, IModalRouter, IRouteConfig } from '../types'
import { isDefined } from 'ts-util-is'
import Route from 'route-parser'
import { useEffect, useState } from 'react'
import { IDefaultRedirection, IRouteConfigMatcher, TFallback } from '../types'

export function isModalRouter(
  router: IMainRouter | IModalRouter
): router is IModalRouter {
  return !!(router as IModalRouter).mainRouter
}

export function isDefaultRedirectionFallback<P>(
  fallback: TFallback<P>
): fallback is IDefaultRedirection {
  return isDefined((fallback as IDefaultRedirection).redirectTo)
}

export function toRouteConfigMatchers(
  routeConfigs: IRouteConfig[],
  basename = ''
) {
  return routeConfigs.map((routeConfig) =>
    toRouteConfigMatcher(routeConfig, basename)
  )
}

function toRouteConfigMatcher(
  routeConfig: IRouteConfig,
  basename: string
): IRouteConfigMatcher {
  const {
    pathPattern: routePathPattern,
    subRoutes: subRoutesConfigs,
    component,
    routeAsyncData,
    hasAccess,
    meta,
    breadcrumbItemData
  } = routeConfig

  let subRoutes: IRouteConfigMatcher[] | undefined
  const pathPattern = concatPaths(basename, routePathPattern)
  const route = new Route(pathPattern)

  if (subRoutesConfigs) {
    const [ basename ] = pathPattern.split(/\(*\?.*/)

    subRoutes = toRouteConfigMatchers(subRoutesConfigs, basename)
  }

  return {
    meta,
    hasAccess,
    routeAsyncData,
    component,
    route,
    subRoutes,
    breadcrumbItemData
  }
}

function concatPaths(leadingPath: string, trailingPath: string) {
  return `${withNoTrailingSlash(leadingPath)}/${withNoLeadingSlash(
    trailingPath
  )}`
}

function withNoLeadingSlash(stringArg: string): string {
  return stringArg.startsWith('/')
    ? withNoLeadingSlash(stringArg.slice(1))
    : stringArg
}

function withNoTrailingSlash(stringArg: string): string {
  return stringArg.endsWith('/')
    ? withNoTrailingSlash(stringArg.slice(0, stringArg.length - 1))
    : stringArg
}

export function useObservedValue<T>(
  getValue: () => T,
  listen: (listener: (value?: T) => void) => () => void
) {
  const [ value, setValue ] = useState(getValue)

  useEffect(() => {
    const unsubscribe = listen((value = getValue()) => {
      setValue(value)
    })

    const currentValue = getValue()

    setValue(currentValue)

    return unsubscribe
  }, [ getValue, listen ])

  return value
}
