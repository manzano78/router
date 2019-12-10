import { IBreadcrumbItem } from '../../RouteStateContext'
import { ReactNode } from 'react'

export interface IBreadcrumbItemProps {
  item: IBreadcrumbItem
  itemIndex: number
  itemPlaceholder: NonNullable<ReactNode> | null
  children?: (
    itemContent: ReactNode,
    isLastItem: boolean,
    itemIndex: number
  ) => ReactNode
}
