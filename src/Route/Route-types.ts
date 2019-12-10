import { ReactNode } from 'react'

export interface IRouteProps {
  defaultPlaceholder?: NonNullable<ReactNode> | null
  errorFallback?: ReactNode | ((error: any) => ReactNode)
}
