import { History, Path, LocationState } from 'history'
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  IDirector,
  IDisplayableRoute,
  IModalRouterContainerProps,
  IRoute,
  IRouteProps, IRouterOptions,
  IRouterProps,
  TIsLoadingNextRoute,
  TModalManager,
  TRouter
} from './types'
import { isMainRouter, isModalRouter } from './utils'
import { isFunction } from 'ts-util-is'
import { RouteError } from './errors/RouteError'
import { createMainRouter } from './core/createMainRouter'

const RouterContext = createContext<TRouter>(null as any)

export function Router(props: IRouterProps) {
  const {
    history,
    children,
    asyncDataErrorComponent,
    routes,
    accessArg,
    accessDeniedComponent,
    asyncDataEnhancer,
    defaultHasAccess,
    pageNotFoundComponent
  } = props
  const routerOptions = useMemo(
    (): IRouterOptions => ({
      asyncDataErrorComponent,
      routes,
      accessArg,
      accessDeniedComponent,
      asyncDataEnhancer,
      defaultHasAccess,
      pageNotFoundComponent
    }),
    [
      asyncDataErrorComponent,
      routes,
      accessArg,
      accessDeniedComponent,
      asyncDataEnhancer,
      defaultHasAccess,
      pageNotFoundComponent
    ]
  )
  const mainRouter = useMemo(
    () => createMainRouter(history, routerOptions),
    [history, routerOptions]
  )

  useEffect(mainRouter.start, [mainRouter])

  return (
    <RouterContext.Provider value={mainRouter}>
      {children}
    </RouterContext.Provider>
  )
}

export function ModalRouterContainer({ children }: IModalRouterContainerProps) {
  const modalRouter = useModalRouter()

  if (!modalRouter) {
    return null
  }

  return (
    <RouterContext.Provider value={modalRouter}>
      {children}
    </RouterContext.Provider>
  )
}

export function Route(props: IRouteProps) {
  const {
    currentRoute,
    isLoadingNextRoute,
    error
  } = useDisplayableRouteState()
  const currentView = getCurrentView(currentRoute, error)
  const { loadingView = currentView } = props

  if (isLoadingNextRoute) {
    return isFunction(loadingView)
      ? loadingView(currentView)
      : loadingView
  }

  return currentView
}

export function useRoute() {
  const displayableRouteState = useDisplayableRouteState()

  return useMemo(
    (): [IRoute | null, TIsLoadingNextRoute] => {
      const { currentRoute, isLoadingNextRoute } = displayableRouteState
      const route = currentRoute && {
        params: currentRoute.params,
        data: currentRoute.data,
        meta: currentRoute.meta,
        reload: currentRoute.reload
      }

      return [route, isLoadingNextRoute]
    },
    [displayableRouteState]
  )
}

export function useLocation() {
  const history = useHistory()

  return useHistoryLocation(history)
}

export function useHistory() {
  const { history } = useRouter()

  return history
}

export function useMainDirector() {
  const router = useRouter()

  return useMemo(
    () => isMainRouter(router) ? router.history : router.mainRouter.history,
    [router]
  )
}

export function useIsInModal() {
  const router = useRouter()

  return useMemo(
    () => isModalRouter(router),
    [router]
  )
}

export function useIsModalOpen() {
  const modalRouter = useModalRouter()

  return useMemo(
    () => !!modalRouter,
    [modalRouter]
  )
}

export function useModalManager() {
  const router = useRouter()

  return useMemo(
    (): TModalManager => {
      return isMainRouter(router)
        ? { isInModal: false, openModal: router.openModal }
        : { isInModal: true, closeModal: router.closeModal }
    },
    [router]
  )
}

function useDisplayableRouteState() {
  const router = useRouter()
  const [routeState, setRouteState] = useState(router.getRouteState)

  useEffect(() => {
    const { listenToRouteState, getRouteState } = router

    const unregisterListener = listenToRouteState(() => {
      const newRouteState = getRouteState()

      setRouteState(newRouteState)
    })

    const currentRouteState = getRouteState()

    if (routeState !== currentRouteState) {
      setRouteState(routeState)
    }

    return unregisterListener
  }, [router])

  return routeState
}

function useRouter() {
  return useContext(RouterContext)
}

function useModalRouter() {
  const router = useRouter()
  const [modalRouter, setModalRouter] = useState(() => {
    return isModalRouter(router) ? router : router.getModalRouter()
  })

  useEffect(() => {
    if (isModalRouter(router)) {
      setModalRouter(router)

      return
    }

    const { getModalRouter, listenToModalRouter } = router
    const unregisterListener = listenToModalRouter(() => {
      const newModalRouter = getModalRouter()

      setModalRouter(newModalRouter)
    })

    const currentModalRouter = router.getModalRouter()

    if (currentModalRouter !== modalRouter) {
      setModalRouter(currentModalRouter)
    }

    return unregisterListener
  }, [router])

  return modalRouter
}


function useHistoryLocation(history: History) {
  const [location, setLocation] = useState(history.location)

  useEffect(() => {
    const unregisterLocationListener = history.listen(setLocation)
    const { location: currentLocation } = history

    if (location !== currentLocation) {
      setLocation(currentLocation)
    }

    return unregisterLocationListener
  }, [history])

  return location
}

function getCurrentView(
  currentRoute: IDisplayableRoute | null,
  error: RouteError<any> | null
) {
  if (error) {
    const {
      fallbackComponent: FallbackComponent,
      fallbackComponentProps
    } = error

    return (
      <FallbackComponent {...fallbackComponentProps} />
    )
  }

  if (!currentRoute) {
    return null
  }

  const { component: RouteComponent } = currentRoute

  return (
    <RouteComponent />
  )
}
