import { IFallbackContainerProps } from './FallbackContainer-types'
import { useRouteData } from '../../RouteStateContext'

export function useController(props: IFallbackContainerProps) {
  const { children } = props

  useRouteData()

  return { children }
}
