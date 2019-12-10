import { ReactNode } from 'react'

export interface IBreadcrumbProps {
  itemPlaceholder: NonNullable<ReactNode> | null
  errorFallback?: ReactNode | ((error: any) => ReactNode)
  children?: (
    itemContent: ReactNode,
    isLastItem: boolean,
    itemIndex: number
  ) => ReactNode
}
