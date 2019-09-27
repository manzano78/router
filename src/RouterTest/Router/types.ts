import { History, LocationState, LocationDescriptor } from 'history'
import { ComponentType, Dispatch, ReactElement, ReactNode, SetStateAction } from 'react'
import { RouteError } from './errors/RouteError'

export interface IMainRouterModalManager {
  isInModal: false
  openModal(initialLocation: LocationDescriptor, onClose: TOnModalClose): void
}

export interface IModalRouterModalManager {
  isInModal: true
  closeModal(...args: any[]): void
}

export type TModalManager = IMainRouterModalManager | IModalRouterModalManager

export interface IDirector {
  goTo(location: LocationDescriptor, state?: LocationState): void
  redirectTo(location: LocationDescriptor, state?: LocationState): void
  goBack(): void
  goForward(): void
  go(n: number): void
}

export type TOnModalClose = (...args: any[]) => void

export interface IRouteParams {
  [param: string]: string
}

export interface IRoute {
  params: IRouteParams
  data: any
  meta: any
  reload: () => void
  parent?: IParentRoute
}

export interface IDisplayableRoute extends IRoute {
  component: ComponentType<{}>
}

export interface IParentRoute {
  path: string
}

export interface IDisplayableRouteState {
  currentRoute: IDisplayableRoute | null
  isLoadingNextRoute: boolean
  error: RouteError<any> | null
}

export interface IRouteObserver {
  getRouteState: () => IDisplayableRouteState
  setRouteState: Dispatch<SetStateAction<IDisplayableRouteState>>
  listenToRouteState: TListen
}

export interface IBaseRouter extends IRouteObserver {
  history: History
}

export interface IMainRouter extends IBaseRouter {
  openModal: (initialLocation: LocationDescriptor, onClose: TOnModalClose) => void
  getModalRouter: () => IModalRouter | null
  listenToModalRouter: TListen
  start: () => TStopRouter
}

export interface IModalRouter extends IBaseRouter {
  mainRouter: IMainRouter
  closeModal: (...args: any[]) => void
}

export type TRouter = IMainRouter | IModalRouter

export type TListener = () => void
export type TUnregisterListener = () => void
export type TListen = (listener: TListener) => TUnregisterListener

export interface IModalRouterContainerProps {
  children: ReactNode
}

export interface IRouteProps {
  loadingView?: ReactNode | ((currentView: ReactElement | null) => ReactNode)
}

export interface IRouterOptions {
  accessArg?: any
  defaultHasAccess?: boolean
  asyncDataErrorComponent?: ComponentType<IAsyncDataErrorComponentProps>
  accessDeniedComponent?: ComponentType<{}>
  pageNotFoundComponent?: ComponentType<{}>
  routes: IRouteConfig[]
  dataResolvingCancellation?: () => ICancellation
  dataResolvingArg?: any
}

export interface ICancellablePromise {
  promise: Promise<any>
  cancel: TCancel
  isCancel?: (error: any) => boolean
}

export type TCancel = () => void

export interface IRouterProps extends IRouterOptions {
  history: History
  children?: ReactNode
}

export type TStopRouter = () => void

export interface IAsyncDataErrorComponentProps {
  error: any
}

export type TIsLoadingNextRoute = boolean

export interface IRouteConfig {
  pathPattern: string
  component: ComponentType<{}>
  hasAccess?: (accessArg: any) => boolean
  data?: (
    params: IRouteParams,
    finalRouteData: any,
    resolvingArg: any,
    cancellationArg: any
  ) => any | Promise<any>
  meta?: any | ((params: IRouteParams, finalRouteData: any, ownData: any) => any)
  subRoutes?: IRouteConfig[]
}

export interface ICancellation {
  cancel: () => void
  isCancelError?: (error: any) => boolean
  cancelArg?: any
}
