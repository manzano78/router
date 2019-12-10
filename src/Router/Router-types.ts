import { History, LocationDescriptor, Location } from 'history'
import { getConfirmation } from 'history/DOMUtils'
import { ComponentType, ReactNode } from 'react'
import {
  ICancellation,
  TBreadcrumbItemAsyncDataConfig,
  TFallback,
  TGetFallback,
  TRouteAsyncDataConfig
} from './RouterInstance'
import { IBreadcrumbItemProps, IRouteParams } from '../RouteStateContext'
import { IModalOptions } from '../ModalOptionsContext'

export interface IModalComponentProps {
  options: IModalOptions
}

export interface IDisplayableRouteConfig {
  path: string | string[]
  hasAccess?: (accessArg: any) => boolean
  component: ComponentType<{}>
  placeholderComponent?: ComponentType<{}>
  routeAsyncData?: TRouteAsyncDataConfig
  breadcrumbItemData?: TBreadcrumbItemAsyncDataConfig
  breadcrumbItemComponent?: ComponentType<IBreadcrumbItemProps>
  meta?: any
  subRoutes?: TRouteConfig[]
}

export interface IRedirectionRouteConfig {
  path: string | string[]
  hasAccess?: (accessArg: any) => boolean
  redirectTo:
    | LocationDescriptor
    | ((location: Location, params: IRouteParams) => LocationDescriptor)
  breadcrumbItemData?: TBreadcrumbItemAsyncDataConfig
  breadcrumbItemComponent?: ComponentType<IBreadcrumbItemProps>
  subRoutes?: TRouteConfig[]
}

export type TRouteConfig = IDisplayableRouteConfig | IRedirectionRouteConfig

export interface IRouterProps {
  history: History
  routes: TRouteConfig[]
  baseModalOptions?: IModalOptions
  modalHistoryUserConfirmation?: typeof getConfirmation
  defaultHasAccess?: boolean
  hasAccessInheritance?: boolean
  accessArg?: any
  dataResolvingArg?: any
  onAccessDenied?: TFallback | TGetFallback
  onRouteNotFound?: TFallback | TGetFallback
  cancellation?: ICancellation
  children?: ReactNode
  modalComponent?: ComponentType<IModalComponentProps>
}
