import {
  IDisplayableRoute,
  IDisplayableRouteState,
  IMatch,
  IRouter,
  IRouterEnhancement,
  IRouterOptions,
  TBreadcrumb
} from './types'
import { createPath, History, Location, LocationListener } from 'history'
import { TData } from './types'
import noop from 'noop-ts'
import { BehaviorSubject } from 'rxjs'
import { SetStateAction } from 'react'
import { isFunction } from 'ts-util-is'
import {
  assertHasAccess,
  assertMatchExistence,
  getRouteAsyncData, hasAnyPromiseToResolve, isRouteError, isRouteErrorSuggestingRedirection,
  searchMatch,
  toBreadcrumb,
  toMetaData
} from './utils'
import {
  listenToObservable
} from './utils'
import { createRouteError } from './createRouteError'

const INITIAL_ROUTE_STATE: IDisplayableRouteState = {
  isLoadingNextRoute: false,
  currentRoute: {
    params: {},
    data: {},
    meta: {},
    breadcrumb: [],
    reloadFully: noop,
    reload: noop,
    component: () => null
  }
}

export function createRouter<E extends IRouterEnhancement>(
  history: History,
  getOptions: () => IRouterOptions,
  enhancement: E,
  additionalLocationListener?: LocationListener
) {
  let cancelRouteLoading = noop
  const routeState$ = new BehaviorSubject(INITIAL_ROUTE_STATE)

  const setRouteState = (routeState: SetStateAction<IDisplayableRouteState>) => {
    const { value: currentCurrentState } = routeState$
    const newRouteState = isFunction(routeState)
      ? routeState(currentCurrentState)
      : routeState

    if (newRouteState !== currentCurrentState) {
      routeState$.next(newRouteState)
    }
  }

  const toRouteLoader = (location: Location) => {
    const loadRouteFromLocation = () => {
      cancelRouteLoading()
      loadRoute(location, loadRouteFromLocation)
    }

    return loadRouteFromLocation
  }

  const loadRoute = (location: Location, reloadFully: () => void) => {
    try {
      const {
        routes,
        accessArg,
        defaultHasAccess,
        hasAccessInheritance,
        onAccessDenied,
        onRouteNotFound
      } = getOptions()
      const path = createPath(location)
      const match = searchMatch(path, routes)

      assertMatchExistence(match, onRouteNotFound, reloadFully)

      const load = () => {
        cancelRouteLoading()

        assertHasAccess(
          match!,
          accessArg,
          defaultHasAccess,
          hasAccessInheritance,
          onAccessDenied,
          load,
          reloadFully
        )

        finalizeRoute(match!, load, reloadFully)
      }

      load()
    } catch (error) {
      handleRouteLoadingError(error)
    }
  }

  const finalizeRoute = (
    match: IMatch,
    reload: () => void,
    reloadFully: () => void
  ) => {
    const { routeAsyncData, params } = match
    const { dataResolvingArg } = getOptions()
    const { signal, hasBeenCancelled } = nextCancellation()
    const routeData = getRouteAsyncData(
      routeAsyncData,
      params,
      dataResolvingArg,
      signal
    )
    const breadcrumb = toBreadcrumb(
      match,
      dataResolvingArg,
      signal,
      routeData
    )
    const dataToResolve: [
      Promise<TData> | undefined,
      TBreadcrumb | Promise<TBreadcrumb>
      ] = [routeData, breadcrumb]

    if (hasAnyPromiseToResolve(dataToResolve)) {
      setRouteState(({ currentRoute }) => ({
        currentRoute,
        isLoadingNextRoute: true
      }))

      Promise.all(dataToResolve)
        .then(([data, breadcrumb]) => {
          handleRouteAsyncDataSuccess(
            match,
            data,
            breadcrumb,
            hasBeenCancelled,
            reload,
            reloadFully
          )
        })
        .catch((error: any) => {
          handleRouteAsyncDataError(error, reload, reloadFully)
        })
    } else {
      const { component, params, meta: metaConfig } = match
      const [data, breadcrumb] = dataToResolve as [TData, TBreadcrumb]
      const meta = toMetaData(params, metaConfig, data)

      setRouteState({
        isLoadingNextRoute: false,
        currentRoute: {
          params,
          component,
          reloadFully,
          reload,
          data,
          breadcrumb,
          meta
        }
      })
    }
  }

  const handleRouteLoadingError = (error: any) => {
    if (isRouteError(error)) {
      if (isRouteErrorSuggestingRedirection(error)) {
        history.replace(error.redirection as string)
      } else {
        setRouteState({
          isLoadingNextRoute: false,
          currentRoute: error.fallbackRoute
        })
      }
    } else {
      throw error
    }
  }

  const nextCancellation = () => {
    const { cancellationCreator: createCancellation } = getOptions()
    const { cancel: applyCancellation, signal } = createCancellation()

    const cancel = () => {
      applyCancellation()
      cancelRouteLoading = noop
    }

    cancelRouteLoading = cancel

    return {
      signal,
      hasBeenCancelled: () => cancelRouteLoading !== cancel
    }
  }

  const handleRouteAsyncDataSuccess = (
    match: IMatch,
    data: TData,
    breadcrumb: TBreadcrumb,
    hasBeenCancelled: () => boolean,
    reload: () => void,
    reloadFully: () => void
  ) => {
    setRouteState(({ currentRoute }) => {
      let newRoute: IDisplayableRoute

      if (hasBeenCancelled()) {
        newRoute = currentRoute
      } else {
        const { component, params, meta: metaConfig } = match
        const meta = toMetaData(params, metaConfig, data)
        newRoute = {
          component,
          breadcrumb,
          meta,
          params,
          reload,
          reloadFully,
          data
        }
      }

      return {
        isLoadingNextRoute: false,
        currentRoute: hasBeenCancelled() ? currentRoute : newRoute
      }
    })
  }

  const handleRouteAsyncDataError = (
    error: any,
    reload: () => void,
    reloadFully: () => void
  ) => {
    const { isCancelError, onDataResolvingError } = getOptions()

    if (!isCancelError(error)) {
      const fallback = onDataResolvingError(error)
      const routeError = createRouteError(fallback, reloadFully, reload)

      handleRouteLoadingError(routeError)
    }
  }

  const router: IRouter & E = {
    history,
    stop: noop,
    getRouteState: () => routeState$.value,
    listenToRouteState: (listener: (routeState: IDisplayableRouteState) => void) =>
      listenToObservable(routeState$, listener),
    get isStarted() {
      return router.stop !== noop
    },
    start: () => {
      if (!router.isStarted) {
        const unregisterAdditionalLocationListener = additionalLocationListener && history.listen(additionalLocationListener)
        const unregisterRouting = history.listen((location) => {
          const loadNextRoute = toRouteLoader(location)

          loadNextRoute()
        })

        const loadInitialRoute = toRouteLoader(history.location)

        loadInitialRoute()

        router.stop = () => {
          if (unregisterAdditionalLocationListener) {
            unregisterAdditionalLocationListener()
          }

          unregisterRouting()
          cancelRouteLoading()
          setRouteState(INITIAL_ROUTE_STATE)
          router.stop = noop
        }
      }

      return router.stop
    },
    ...enhancement
  }

  return router
}
