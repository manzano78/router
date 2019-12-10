import { useRouteView } from '../RouteStateContext'
import { IRouteProps } from './Route-types'

export function useController(props: IRouteProps) {
  const { errorFallback, defaultPlaceholder = null } = props

  const { RouteView, PlaceholderComponent, routeViewKey } = useRouteView()

  return {
    RouteView,
    PlaceholderComponent,
    routeViewKey,
    errorFallback,
    defaultPlaceholder
  }
}
