import {
  IDisplayableMatch,
  IDisplayableRouteConfigMatcher,
  TFallback,
  TMatch,
  TRouteConfigMatcher
} from './RouterInstance-types'
import { IRouteParams } from '../../RouteStateContext'
import { isDefined } from 'ts-util-is'
import { IDefaultRedirection, IParentRoute } from './RouterInstance-types'

export function toParent(
  params: IRouteParams,
  getParent?: (params: IRouteParams) => IParentRoute
) {
  return getParent && getParent(params)
}

export function isDefaultRedirectionFallback<P>(
  fallback: TFallback<P>
): fallback is IDefaultRedirection {
  return isDefined((fallback as IDefaultRedirection).redirectTo)
}

export function isDisplayableRouteConfig(
  routeConfig: TRouteConfigMatcher
): routeConfig is IDisplayableRouteConfigMatcher {
  return !!(routeConfig as IDisplayableRouteConfigMatcher).component
}

export function isDisplayableMatch(match: TMatch): match is IDisplayableMatch {
  return !!(match as IDisplayableMatch).component
}
