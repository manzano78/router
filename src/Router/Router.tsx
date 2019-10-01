import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef
} from 'react'
import {
  IRouteProps,
  TIsLoadingNextRoute,
} from './types'
import { isFunction } from 'ts-util-is'
import {
  DEFAULT_ON_ROUTE_NOT_FOUND
} from './constants'
import { createMainRouter } from '../createMainRouter'
import { isDefaultRedirectionFallback, toRouteConfigMatchers, isModalRouter, useObservedValue } from './utils'
import { DEFAULT_CANCELLATION_SYSTEM, DEFAULT_ON_ACCESS_DENIED, DEFAULT_ON_ASYNC_ERROR } from './constants'
import {
  IBreadcrumbProps, IMainRouter,
  IModalRouterContainerProps, IRoute,
  IRouterOptions,
  IRouterProps,
  TBreadcrumb,
  TFallback,
  TRouter
} from '../types'

const RouterContext = createContext<TRouter>(null as any)

export function Router(props: IRouterProps) {
  const {
    children,
    history,
    routes,
    accessArg,
    hasAccessInheritance = true,
    defaultHasAccess = false,
    dataResolvingArg,
    defaultModalOptions = {},
    modalHistoryUserConfirmation,
    isCancelError = () => false,
    cancellationCreator = DEFAULT_CANCELLATION_SYSTEM,
    onDataResolvingError: providedOnDataResolvingError = DEFAULT_ON_ASYNC_ERROR,
    onRouteNotFound = DEFAULT_ON_ROUTE_NOT_FOUND,
    onAccessDenied = DEFAULT_ON_ACCESS_DENIED
  } = props
  const routeConfigMatchers = useMemo(() => toRouteConfigMatchers(routes), [
    routes
  ])
  const onDataResolvingError = useCallback(
    (error: any): TFallback => {
      const base = isFunction(providedOnDataResolvingError)
        ? providedOnDataResolvingError()
        : providedOnDataResolvingError

      if (isDefaultRedirectionFallback(base)) {
        return base
      }

      const { display: ErrorView } = base

      return { display: () => <ErrorView error={error} /> }
    },
    [providedOnDataResolvingError]
  )
  const routerOptions: IRouterOptions = {
    accessArg,
    hasAccessInheritance,
    defaultHasAccess,
    dataResolvingArg,
    isCancelError,
    cancellationCreator,
    onDataResolvingError,
    onRouteNotFound,
    onAccessDenied,
    routes: routeConfigMatchers
  }

  const routerRef = useRef<IMainRouter | null>(null)

  const { current: getRouter } = useRef(() => {
    if (!routerRef.current) {
      routerRef.current = createMainRouter(
        history,
        routerOptions,
        defaultModalOptions,
        modalHistoryUserConfirmation
      )
    }

    return routerRef.current
  })

  const router = getRouter()

  useEffect(router.start, [])

  useEffect(() => {
    router.options = routerOptions
    router.defaultModalOptions = defaultModalOptions
    router.modalHistoryUserConfirmation = modalHistoryUserConfirmation
  })

  return (
    <RouterContext.Provider value={router}>{children}</RouterContext.Provider>
  )
}

export function ModalContainer({ children }: IModalRouterContainerProps) {
  const modalRouter = useModalRouter()

  if (!modalRouter) {
    return null
  }

  return (
    <RouterContext.Provider value={modalRouter}>
      {isFunction(children) ? children(modalRouter.modalOptions) : children}
    </RouterContext.Provider>
  )
}

export function Route(props: IRouteProps) {
  const { currentRoute, isLoadingNextRoute } = useDisplayableRouteState()
  const { component: Component } = currentRoute
  const currentView = <Component />
  const { loadingView = currentView } = props

  if (isLoadingNextRoute) {
    return isFunction(loadingView) ? loadingView(currentView) : loadingView
  }

  return currentView
}

export function Breadcrumb({ children }: IBreadcrumbProps) {
  const [breadcrumb, isLoadingNextRoute] = useBreadcrumb()

  return <>{children(breadcrumb, isLoadingNextRoute)}</>
}

export function useModalOptions() {
  const modalRouter = useModalRouter()

  if (modalRouter) {
    return modalRouter.modalOptions
  }

  throw new Error('Cannot use modal options outside a modal.')
}

export function useRoute() {
  const displayableRouteState = useDisplayableRouteState()

  return useMemo((): [IRoute, TIsLoadingNextRoute] => {
    const { currentRoute, isLoadingNextRoute } = displayableRouteState
    const { reload, reloadFully, data, meta, params } = currentRoute
    const route: IRoute = {
      params,
      meta,
      data,
      reload,
      reloadFully
    }

    return [route, isLoadingNextRoute]
  }, [displayableRouteState])
}

export function useBreadcrumb(): [TBreadcrumb, TIsLoadingNextRoute] {
  const { currentRoute, isLoadingNextRoute } = useDisplayableRouteState()
  const breadcrumb = useMemo(() => currentRoute.breadcrumb, [currentRoute])

  return [breadcrumb, isLoadingNextRoute]
}

export function useLocation() {
  const history = useHistory()
  const getLocation = useCallback(() => history.location, [history])

  return useObservedValue(getLocation, history.listen)
}

export function useHistory() {
  const { history } = useRouter()

  return history
}

export function useMainHistory() {
  const { history } = useMainRouter()

  return history
}

export function useIsInModal() {
  const router = useRouter()

  return useMemo(() => isModalRouter(router), [router])
}

export function useIsModalOpen() {
  const modalRouter = useModalRouter()

  return useMemo(() => !!modalRouter, [modalRouter])
}

export function useOpenModal() {
  const { openModal } = useMainRouter()

  return openModal
}

export function useCloseModal() {
  const { closeModal } = useMainRouter()

  return closeModal
}

export function useCloseModalSilently() {
  const { closeModalSilently } = useMainRouter()

  return closeModalSilently
}

function useDisplayableRouteState() {
  const { getRouteState, listenToRouteState } = useRouter()

  return useObservedValue(getRouteState, listenToRouteState)
}

function useMainRouter() {
  const router = useRouter()

  return useMemo(
    () => isModalRouter(router) ? router.mainRouter : router,
    [router]
  )
}

function useModalRouter() {
  const { getModalRouter, listenToModalRouter } = useMainRouter()

  return useObservedValue(getModalRouter, listenToModalRouter)
}

function useRouter() {
  return useContext(RouterContext)
}
