import { History, Location, LocationDescriptor } from 'history'
import { ComponentType, ReactNode } from 'react'
import { IBreadcrumbItemProps, IRouteParams } from '../../RouteStateContext'
import Route from 'route-parser'
import { PENDING, REJECTED, RESOLVED } from './RouterInstance-constants'

export interface IDisplayableRouteConfigMatcher {
  meta: any
  route: Route
  hasAccess?: (accessArg: any) => boolean
  component: ComponentType<{}>
  placeholderComponent?: ComponentType<{}>
  routeAsyncData?: TRouteAsyncDataConfig
  breadcrumbItemData?: TBreadcrumbItemAsyncDataConfig
  breadcrumbItemComponent?: ComponentType<IBreadcrumbItemProps>
  subRoutes?: TRouteConfigMatcher[]
}

export interface IRedirectionRouteConfigMatcher {
  route: Route
  hasAccess?: (accessArg: any) => boolean
  redirectTo:
    | LocationDescriptor
    | ((location: Location, params: IRouteParams) => LocationDescriptor)
  breadcrumbItemData?: TBreadcrumbItemAsyncDataConfig
  breadcrumbItemComponent?: ComponentType<IBreadcrumbItemProps>
  subRoutes?: TRouteConfigMatcher[]
}

export type TRouteConfigMatcher =
  | IDisplayableRouteConfigMatcher
  | IRedirectionRouteConfigMatcher

export interface ICancellation {
  cancel: () => void
  getSignal: () => any
  isCancelError?: (error: any) => boolean
}

export interface IErrorProps {
  error: any
}

export interface IRouterInstanceProps {
  history: History
  routes: TRouteConfigMatcher[]
  defaultHasAccess?: boolean
  hasAccessInheritance?: boolean
  accessArg: any
  dataResolvingArg: any
  onAccessDenied?: TFallback | TGetFallback
  onRouteNotFound?: TFallback | TGetFallback
  cancellation?: ICancellation
  children: ReactNode
}

export type TBreadcrumbItemAsyncDataConfig = (
  params: IRouteParams,
  resolvingArg: any,
  cancellationArg: any,
  lastRouteAsyncDataPromise?: Promise<any>
) => Promise<any>

export interface IParentRoute {
  path: string
  hasAccess?: (accessArg: any) => boolean
  breadcrumbItemAsyncData?: TBreadcrumbItemAsyncDataConfig
  breadcrumbItemComponent?: ComponentType<IBreadcrumbItemProps>
  parent?: IParentRoute
}

export type TRouteAsyncDataConfig = (
  params: IRouteParams,
  resolvingArg: any,
  cancellationArg: any
) => Promise<any>

export interface IDefaultRedirection {
  redirectTo: LocationDescriptor
}

export interface IDefaultDisplay<P = {}> {
  display: ComponentType<P>
}

export type TFallback<P = {}> = IDefaultDisplay<P> | IDefaultRedirection

export type TGetFallback<P = {}> = (
  location: Location
) => IDefaultDisplay<P> | IDefaultRedirection

export interface IDisplayableMatch {
  path: string
  params: IRouteParams
  hasAccess?: (accessArg: any) => boolean
  component: ComponentType<{}>
  placeholderComponent?: ComponentType<{}>
  routeAsyncData?: TRouteAsyncDataConfig
  breadcrumbItemAsyncData?: TBreadcrumbItemAsyncDataConfig
  breadcrumbItemComponent?: ComponentType<IBreadcrumbItemProps>
  meta: any
  parent?: IParentRoute
}

export interface IRedirectionMatch {
  params: IRouteParams
  hasAccess?: (accessArg: any) => boolean
  redirectTo:
    | LocationDescriptor
    | ((location: Location, params: IRouteParams) => LocationDescriptor)
  parent?: IParentRoute
}

export type TMatch = IDisplayableMatch | IRedirectionMatch

export interface IResolvedDataEntry {
  status: typeof RESOLVED
  result: any
}

export interface IRejectedDataEntry {
  status: typeof REJECTED
  error: any
}

export interface IPendingDataEntry {
  status: typeof PENDING
}

export type TDataEntry =
  | IResolvedDataEntry
  | IPendingDataEntry
  | IRejectedDataEntry
