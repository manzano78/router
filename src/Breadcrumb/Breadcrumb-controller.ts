import { IBreadcrumbProps } from './Breadcrumb-types'
import { useRouteBreadcrumb } from '../RouteStateContext'

export function useController(props: IBreadcrumbProps) {
  const { errorFallback, itemPlaceholder, children } = props

  const breadcrumb = useRouteBreadcrumb()

  return {
    children,
    errorFallback,
    itemPlaceholder,
    breadcrumb
  }
}
