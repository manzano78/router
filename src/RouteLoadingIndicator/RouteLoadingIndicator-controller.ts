import { IRouteLoadingIndicatorProps } from './RouteLoadingIndicator-types'

export function useController(props: IRouteLoadingIndicatorProps) {
  const { children: loadingIndicator, fallback } = props

  return { loadingIndicator, fallback }
}
