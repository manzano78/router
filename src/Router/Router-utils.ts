import { isArray } from 'ts-util-is'
import Route from 'route-parser'
import { TRouteConfigMatcher } from './RouterInstance'
import { IDisplayableRouteConfig, TRouteConfig } from './Router-types'

export function toRouteConfigMatchers(
  routeConfigs: TRouteConfig[],
  basename = ''
) {
  const routeConfigMatchers: TRouteConfigMatcher[] = []

  routeConfigs.forEach((routeConfig) => {
    const {
      path,
      hasAccess,
      breadcrumbItemComponent,
      breadcrumbItemData,
      subRoutes: subRoutesConfigs
    } = routeConfig
    const paths = isArray(path) ? path : [path]

    paths.forEach((routePathPattern) => {
      let subRoutes: TRouteConfigMatcher[] | undefined
      const pathPattern = concatPaths(basename, routePathPattern)
      const route = new Route(pathPattern)

      if (subRoutesConfigs) {
        const [basename] = pathPattern.split(/\(*\?.*/)

        subRoutes = toRouteConfigMatchers(subRoutesConfigs, basename)
      }

      if (isDisplayableRouteConfig(routeConfig)) {
        const {
          component,
          placeholderComponent,
          routeAsyncData,
          meta
        } = routeConfig

        routeConfigMatchers.push({
          meta,
          hasAccess,
          routeAsyncData,
          component,
          placeholderComponent,
          route,
          subRoutes,
          breadcrumbItemData,
          breadcrumbItemComponent
        })
      } else {
        const { redirectTo } = routeConfig

        routeConfigMatchers.push({
          route,
          redirectTo,
          subRoutes,
          breadcrumbItemComponent,
          breadcrumbItemData
        })
      }
    })
  })

  return routeConfigMatchers
}

function concatPaths(leadingPath: string, trailingPath: string) {
  return `${withoutTrailingSlash(leadingPath)}/${withoutLeadingSlash(
    trailingPath
  )}`
}

function withoutLeadingSlash(stringArg: string): string {
  return stringArg.startsWith('/')
    ? withoutLeadingSlash(stringArg.slice(1))
    : stringArg
}

function withoutTrailingSlash(stringArg: string): string {
  return stringArg.endsWith('/')
    ? withoutTrailingSlash(stringArg.slice(0, stringArg.length - 1))
    : stringArg
}

function isDisplayableRouteConfig(
  routeConfig: TRouteConfig
): routeConfig is IDisplayableRouteConfig {
  return !!(routeConfig as IDisplayableRouteConfig).component
}
