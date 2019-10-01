import { History, LocationDescriptor } from 'history'
import { getConfirmation } from 'history/DOMUtils'
import { ComponentType, ReactNode } from 'react'
import Route from 'route-parser'

export type TCloseModal = (...args: any[]) => void
export type TOnModalClose = TCloseModal

export interface IRouteParams {
  [ param: string ]: string
}

export type TData =
  | string
  | number
  | boolean
  | symbol
  | object
  | null
  | undefined

export interface IRoute {
  params: IRouteParams
  data: TData
  meta: TData
  reload: () => void
  reloadFully: () => void
}

export interface IModalRouterContainerProps {
  children: ReactNode | ((modalOptions: IModalOptions) => ReactNode)
}

export interface IBreadcrumbProps {
  children: (breadcrumb: TBreadcrumb, isLoadingNextRoute: boolean) => ReactNode
}

export interface IBaseRouterOptions {
  defaultHasAccess: boolean
  hasAccessInheritance: boolean
  accessArg: any
  dataResolvingArg: any
  onAccessDenied: TFallbackOrGetFallback
  onRouteNotFound: TFallbackOrGetFallback
  cancellationCreator: () => ICancellation
  isCancelError: (error: any) => boolean
}

export interface IRouterOptions extends IBaseRouterOptions {
  routes: IRouteConfigMatcher[]
  onDataResolvingError: (error: any) => TFallback
}

export interface IRouterProps extends Partial<IBaseRouterOptions> {
  history: History
  routes: IRouteConfig[]
  onDataResolvingError?: TFallbackOrGetFallback<IErrorProps>
  defaultModalOptions?: IModalOptions
  modalHistoryUserConfirmation?: typeof getConfirmation
  children?: ReactNode
}

export interface IRouteConfig {
  pathPattern: string
  hasAccess?: (accessArg: any) => boolean
  component: ComponentType<{}>
  routeAsyncData?: TRouteAsyncDataConfig
  breadcrumbItemData?: TBreadcrumbItemDataConfig
  meta?: TMetaConfig
  subRoutes?: IRouteConfig[]
}

export interface IRouteConfigMatcher {
  route: Route
  hasAccess?: (accessArg: any) => boolean
  component: ComponentType<{}>
  routeAsyncData?: TRouteAsyncDataConfig
  breadcrumbItemData?: TBreadcrumbItemDataConfig
  meta?: TMetaConfig
  subRoutes?: IRouteConfigMatcher[]
}

export interface IParentRoute {
  path: string
  hasAccess?: (accessArg: any) => boolean
  breadcrumbItemData?: TBreadcrumbItemDataConfig
  parent?: IParentRoute
}

export interface IMatch {
  path: string
  params: IRouteParams
  hasAccess?: (accessArg: any) => boolean
  component: ComponentType<{}>
  routeAsyncData?: TRouteAsyncDataConfig
  breadcrumbItemData?: TBreadcrumbItemDataConfig
  meta?: TMetaConfig
  parent?: IParentRoute
}

export type TRouteAsyncDataConfig = (
  params: IRouteParams,
  resolvingArg: any,
  cancellationArg: any
) => null | Promise<TData>
export type TBreadcrumbItemDataConfig =
  | TData
  | ((
  params: IRouteParams,
  resolvingArg: any,
  cancellationArg: any,
  lastRouteAsyncDataPromise?: Promise<TData>
) => TData | Promise<TData>)
export type TMetaConfig =
  | TData
  | ((params: IRouteParams, routeData: TData) => TData)

export interface ICancellation {
  cancel: () => void
  signal: any
}

export interface IDefaultDisplay<P = {}> {
  display: ComponentType<P>
}

export interface IDefaultRedirection {
  redirectTo: LocationDescriptor
}

export type TFallback<P = {}> = IDefaultDisplay<P> | IDefaultRedirection
export type TGetFallback<P = {}> = () => TFallback<P>
export type TFallbackOrGetFallback<P = {}> = TFallback<P> | TGetFallback<P>

export interface IBreacrumbItem {
  path: string
  isLast: boolean
  data: TData
}

export type TBreadcrumb = IBreacrumbItem[]

export interface IModalOptions {
  [ optionName: string ]: any
}

export interface IErrorProps {
  error: any
}

export interface IDisplayableRoute extends IRoute {
  component: ComponentType<{}>
  breadcrumb: TBreadcrumb
}

export interface IDisplayableRouteState {
  currentRoute: IDisplayableRoute
  isLoadingNextRoute: boolean
}

export interface IRouter {
  history: History
  isStarted: boolean,
  getRouteState(): IDisplayableRouteState
  listenToRouteState(listener: (routeState: IDisplayableRouteState) => void): TUnregisterListener
  start(): TStopRouter
  stop(): void
}

export interface IMainRouter extends IRouter {
  options: IRouterOptions
  isModalOpen: boolean
  defaultModalOptions: IModalOptions
  modalHistoryUserConfirmation?: typeof getConfirmation
  getModalRouter(): IModalRouter | null
  listenToModalRouter(listener: (modalRouter: IModalRouter | null) => void): TUnregisterListener
  openModal(
    initialLocation: LocationDescriptor,
    modalOptions?: IModalOptions,
    onModalClose?: TOnModalClose
  ): void
  closeModal(...args: any[]): void
  closeModalSilently(): void
}

export interface IModalRouter extends IRouter {
  readonly mainRouter: IMainRouter
  readonly modalOptions: IModalOptions
  readonly onModalClose?: TOnModalClose
}

export interface IRouterEnhancement {
  [p: string]: any
}

type TUnregisterListener = () => void
type TStopRouter = () => void

export interface IRouteError {
  isRouteError: true
}

export interface IErrorSuggestingRedirection extends IRouteError {
  redirection: LocationDescriptor
}

export interface IErrorSuggestingFallbackView extends IRouteError {
  fallbackRoute: IDisplayableRoute
}

export type TRouter = IMainRouter | IModalRouter
