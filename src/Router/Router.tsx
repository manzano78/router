import { createMemoryHistory, createPath, History, Location, Path } from 'history'
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { isFunction } from 'ts-util-is'

import {
  IDirector,
  IMainRouter,
  IModalRouteContainerProps,
  IModalRouter, IRoute, IRouteProps,
  IRouterContext,
  IRouterProviderProps, TCreateHref, TModalRouterListener,
  TOnModalClose, TRelativeRouter
} from './types'
import { isDefaultComponentToDisplay, isDefaultRedirectionToMake, useExpensive } from './utils'
import LocationDescriptor = History.LocationDescriptor

const RouterContext = createContext<IRouterContext>(null as any)
const RouteContext = createContext<IRoute>(null as any)
const IsWithinModalContext = createContext(false)

export function RouterProvider(props: IRouterProviderProps) {
  const { history, children, routes, onRouteNotFound } = props
  const mainRouter = useExpensive((): IMainRouter => ({
    history,
    openModal: (
      initialLocation: LocationDescriptor,
      onClose?: TOnModalClose
    ) => {
      let modalRouter = getModalRouter()

      if (!modalRouter) {
        setModalRouter({
          history: createMemoryHistory({
            initialEntries: [initialLocation as string],
            initialIndex: 0
          }),
          closeModal: (...args: any) => {
            setModalRouter(null)
            onClose && onClose(...args)
          }
        })

        getModalRouterListeners().forEach((modalRouterListener) => {
          modalRouterListener()
        })
      }
    }
  }))
  const modalRouterListenersRef = useRef(null as Set<TModalRouterListener> | null)
  const { current: getModalRouterListeners } = useRef(() => {
    if (!modalRouterListenersRef.current) {
      modalRouterListenersRef.current = new Set()
    }

    return modalRouterListenersRef.current
  })

  const modalRouterRef = useRef(null as IModalRouter | null)
  const { current: getModalRouter } = useRef(() => modalRouterRef.current)
  const { current: setModalRouter } = useRef((modalRouter: IModalRouter | null) => {
    modalRouterRef.current = modalRouter
  })
  const { current: listenToModalRouter } = useRef((listener: TModalRouterListener) => {
    const modalRouterListeners = getModalRouterListeners()

    modalRouterListeners.add(listener)

    return () => {
      modalRouterListeners.delete(listener)
    }
  })

  const routerContext = useMemo(
    (): IRouterContext => ({
      mainRouter,
      getModalRouter,
      routes,
      onRouteNotFound,
      listenToModalRouter
    }),
    [routes, onRouteNotFound]
  )

  return (
    <RouterContext.Provider value={routerContext}>
      {children}
    </RouterContext.Provider>
  )
}

export function ModalRouteContainer({ children }: IModalRouteContainerProps) {
  const isModalOpen = useIsModalOpen()

  return (
    <IsWithinModalContext.Provider value={true}>
      {isModalOpen && children}
    </IsWithinModalContext.Provider>
  )
}

export function Route(props: IRouteProps) {
  const { routes, onRouteNotFound } = useRouterContext()
  const replace = useReplace()
  const currentLocation = useCurrentLocation()
  const matchedRoute = useMemo(
    () => getMatchedRoute(currentLocation, routes),
    [currentLocation, routes]
  )

  useEffect(() => {
    if (!matchedRoute && isDefaultRedirectionToMake(onRouteNotFound)) {
      replace(onRouteNotFound.redirectTo as Path)
    }
  }, [matchedRoute])

  if (!matchedRoute) {
    if (isDefaultComponentToDisplay(onRouteNotFound)) {
      const { display: DefaultComponent } = onRouteNotFound

      return <DefaultComponent/>
    }

    return null
  }

  const { node } = matchedRoute
  const { children = node } = props

  return (
    <RouteContext.Provider value={matchedRoute}>
      {isFunction(children) ? children(matchedRoute) : children}
    </RouteContext.Provider>
  )
}

export function useRoute() {
  return useContext(RouteContext)
}

export function useDirector() {
  const history = useRelativeRouterHistory()

  return useMemo((): IDirector => {
    return {
      push: history.push as any,
      replace: history.replace as any,
      go: history.go,
      goBack: history.goBack,
      goForward: history.goForward
    }
  }, [history])
}

export function useCreateHref(): TCreateHref {
  const { isRelativeToModal, history } = useRelativeRouter()
  const { current: modalCreateHref } = useRef(() => {
    return undefined
  })

  return isRelativeToModal
    ? history.createHref
    : modalCreateHref
}

export function useCurrentLocation() {
  const history = useRelativeRouterHistory()
  const [location, setLocation] = useState(history.location)

  useEffect(() => {
    const unregister = history.listen(setLocation)
    const { location: currentLocation } = history

    if (currentLocation !== location) {
      setLocation(currentLocation)
    }

    return unregister
  }, [])

  return location
}

export function useIsModalOpen() {
  const modalRouter = useModalRouter()

  return useMemo(
    () => modalRouter !== null,
    [modalRouter]
  )
}

export function useIsWithinModal() {
  return useContext(IsWithinModalContext)
}

export function useRoutes() {
  const { routes } = useRouterContext()

  return routes
}

export function useOpenModal() {
  const relativeRouter = useRelativeRouter()

  return relativeRouter.isRelativeToModal ? null : relativeRouter.openModal
}

export function useCloseModal() {
  const relativeRouter = useRelativeRouter()

  return relativeRouter.isRelativeToModal ? relativeRouter.closeModal : null
}

function useRelativeRouter(): TRelativeRouter {
  const isWithinModal = useIsWithinModal()
  const { modalRouter, mainRouter } = useRouterContext()

  return useMemo(() => {
    return isWithinModal
      ? { ...modalRouter!, isRelativeToModal: true }
      : { ...mainRouter, isRelativeToModal: false }
  }, [isWithinModal])
}

function useModalRouter() {
  const { getModalRouter, listenToModalRouter } = useRouterContext()
  const [modalRouter, setModalRouter] = useState(getModalRouter)

  useEffect(() => {
    const unregisterModalRouterListener = listenToModalRouter(() => {
      const modalRouter = getModalRouter()

      setModalRouter(modalRouter)
    })

    const currentModalRouter = getModalRouter()

    if (currentModalRouter !== modalRouter) {
      setModalRouter(currentModalRouter)
    }

    return unregisterModalRouterListener
  }, [])
  return modalRouter
}

function useRelativeRouterHistory() {
  const { history } = useRelativeRouter()

  return history
}

function useRouterContext() {
  return useContext(RouterContext)
}

function getMatchedRoute(location: Location, routes: any[]): IRoute | null {
  return {} as any
}
