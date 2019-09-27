import { Location } from 'history'
import { Dispatch, MutableRefObject, SetStateAction } from 'react'
import {
  IRouterOptions,
  IDisplayableRouteState,
  IRouteParams,
  IDisplayableRoute, IRouteConfig, ICancellablePromise, TCancel, ICancellation
} from '../types'
import { DefaultAccessDenied } from '../DefaultAccessDenied'
import { RouteError } from '../errors/RouteError'
import { DefaultPageNotFound } from '../DefaultPageNotFound'
import { DefaultAsyncDataError } from '../DefaultAsyncDataError'
import { isFunction } from 'ts-util-is'
import { RouteAsyncDataError } from '../errors/RouteAsyncDataError'

export function loadRoute(
  location: Location,
  setRouteState: Dispatch<SetStateAction<IDisplayableRouteState>>,
  routerOptions: IRouterOptions,
  cancelRef: MutableRefObject<TCancel>
) {
  const displayableRoute = searchDisplayableRoute(
    location,
    setRouteState,
    routerOptions
  )

  if (displayableRoute instanceof Promise) {
    displayableRoute
      .then((currentRoute: IDisplayableRoute) => {
        setRouteState({
          error: null,
          isLoadingNextRoute: false,
          currentRoute
        })
      })
      .catch((error: any) => {
        if (error instanceof RouteError) {
          setRouteState({
            error,
            currentRoute: null,
            isLoadingNextRoute: false
          })
        } else {
          throw error
        }
      })
  } else {
    setRouteState({
      error: null,
      isLoadingNextRoute: false,
      currentRoute: displayableRoute
    })
  }
}

function searchDisplayableRoute(
  location: Location,
  setRouteState: Dispatch<SetStateAction<IDisplayableRouteState>>,
  routerOptions: IRouterOptions
): IDisplayableRoute | Promise<IDisplayableRoute> {
  const {
    routes,
    accessArg,
    defaultHasAccess = false,
    accessDeniedComponent = DefaultAccessDenied,
    pageNotFoundComponent = DefaultPageNotFound,
    asyncDataErrorComponent = DefaultAsyncDataError,
    asyncDataEnhancer = (
      routeParams: IRouteParams,
      resolve: (routeParams: IRouteParams, ...args: any[]) => Promise<any>
    ) => resolve(routeParams)
  } = routerOptions
}

function toDisplayableRoute(
  route: IRouteConfig,
  params: IRouteParams,
  setRouteState: Dispatch<SetStateAction<IDisplayableRouteState>>,
  cancelRef: MutableRefObject<TCancel | null>,
  dataResolvingCancellation?: () => ICancellation,
): void | Promise<void> {
  const {
    data,
    component,
    meta,
  } = route
  let load: () => void

  if (!data) {
    cancelRef.current = null

    load = () => {
      const data = null
      const displayableRoute: IDisplayableRoute = {
        params,
        component,
        data,
        meta: resolveMeta(meta, params, data),
        reload: load
      }

      setRouteState({
        error: null,
        isLoadingNextRoute: false,
        currentRoute: displayableRoute
      })
    }
  } else {
    load = () => {
      setRouteState((state) => ({
        ...state,
        isLoadingNextRoute: true
      }))

      const cancellation = dataResolvingCancellation && dataResolvingCancellation()

      if (cancellation) {
        cancelRef.current = cancellation.cancel
      }

      const result = data(
        params,
        null,
        null,
        cancellation && cancellation.cancelArg
      )

      if (result instanceof Promise) {
        result
          .then((data) => {
            const displayableRoute: IDisplayableRoute = {
              params,
              data,
              reload: load,
              meta: resolveMeta(meta, params, data),
              component
            }

            setRouteState({
              error: null,
              isLoadingNextRoute: false,
              currentRoute: displayableRoute
            })
          })
          .catch((error) => {
            if (!cancellation || !cancellation.isCancelError || !cancellation.isCancelError(error)) {
              setRouteState({
                currentRoute: null,
                isLoadingNextRoute: false,
                error: new RouteAsyncDataError(() => null, error)
              })
            }
          })
      } else {
        resultPromise = result.promise
        isCancel = result.isCancel
        cancelRef.current = result.cancel
      }


    }
  }

  load()
}

function resolveMeta(
  meta: any | ((params: IRouteParams, fetchedData: any) => any),
  params: IRouteParams,
  data: any
) {
  return isFunction(meta) ? meta(params, data) : meta
}
