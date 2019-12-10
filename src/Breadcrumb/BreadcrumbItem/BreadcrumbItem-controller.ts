import { IBreadcrumbItemProps } from './BreadcrumbItem-types'

export function useController(props: IBreadcrumbItemProps) {
  const {
    item,
    itemIndex: index,
    itemPlaceholder: placeholder,
    children: transformView
  } = props

  const { isLast, path, data, component: ItemView } = item

  return {
    index,
    isLast,
    path,
    data,
    placeholder,
    transformView,
    ItemView
  }
}
