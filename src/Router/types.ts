import { History, LocationDescriptorObject, Location } from 'history'
import { ComponentType, ReactNode } from 'react'
import LocationDescriptor = History.LocationDescriptor

export interface IRouterContext {
  routes: any[]
  onRouteNotFound: TOnRouteNotFound
  mainRouter: IMainRouter
  getModalRouter: () => IModalRouter | null
  listenToModalRouter: (listener: TModalRouterListener) => TUnregisterModalRouterListener
}

export type TModalRouterListener = () => void
export type TUnregisterModalRouterListener = () => void

export interface IBaseRouter {
  history: History
}

export interface IMainRouter extends IBaseRouter {
  openModal: TOpenModal
}

export interface IModalRouter extends IBaseRouter {
  closeModal: TCloseModal
}

export type TCloseModal = (...args: any[]) => void
export type TOnModalClose = TCloseModal

export interface IRouterProviderProps {
  routes: any[]
  history: History
  onRouteNotFound: TOnRouteNotFound
  children?: ReactNode
}

export type TOpenModal = (
  initialLocation: LocationDescriptor,
  onClose?: TOnModalClose
) => void

export interface IModalRouteContainerProps {
  children?: ReactNode
}

export interface IMainRelativeRouter extends IMainRouter {
  isRelativeToModal: false
}

export interface IModalRelativeRouter extends IModalRouter {
  isRelativeToModal: true
}

export type TRelativeRouter = IMainRelativeRouter | IModalRelativeRouter

export type TCreateHref = (
  location: LocationDescriptorObject
) => string | undefined

export interface IDefaultComponent {
  display: ComponentType<{}>
}

export interface IDefaultRedirection {
  redirectTo: LocationDescriptor
}

export type TOnRouteNotFound =IDefaultComponent | IDefaultRedirection

export interface IRouteParams {
  [paramName: string]: string | string[]
}

export interface IRoute {
  location: Location
  params: IRouteParams
  resolvedData: any
  node: ReactNode
}

export interface IRouteProps {
  children?: ReactNode | ((route: IRoute) => ReactNode)
}

export interface IDirector {
  push: (location: LocationDescriptor, state?: any) => void
  replace: (location: LocationDescriptor, state?: any) => void
  go:(n: number) => void
  goBack:() => void
  goForward:() => void
}
