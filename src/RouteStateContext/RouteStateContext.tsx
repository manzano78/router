import { createContext, useFinalAttribute } from '@manzano/component-utils'
import { IRoute } from './RouteStateContext-types'
import { useMemo } from 'react'

const [RouteProvider, useRoute] = createContext<IRoute>()

function useRouteData<V = any>() {
  const { data } = useRoute()

  return data as V
}

function useRouteMeta<V = any>() {
  const { meta } = useRoute()

  return meta as V
}

function useRouteParams() {
  const { params } = useRoute()

  return params
}

function useRouteParam(paramName: string) {
  const { [paramName]: param } = useRouteParams()

  return param
}

function useRouteBreadcrumb() {
  const { breadcrumb } = useRoute()

  return breadcrumb
}

function useRouteView() {
  const route = useRoute()
  const getNextRouteViewKey = useFinalAttribute(() => {
    let routeViewKey = 0

    return () => {
      routeViewKey = routeViewKey ? 0 : 1

      return routeViewKey
    }
  })

  return useMemo(() => {
    const {
      component: RouteView,
      placeholderComponent: PlaceholderComponent
    } = route
    const routeViewKey = getNextRouteViewKey()

    return { RouteView, routeViewKey, PlaceholderComponent }
  }, [route])
}

export {
  RouteProvider,
  useRouteParams,
  useRouteView,
  useRouteBreadcrumb,
  useRouteData,
  useRouteMeta,
  useRouteParam
}
