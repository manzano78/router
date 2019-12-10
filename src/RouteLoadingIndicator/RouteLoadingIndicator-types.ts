import { ReactNode } from 'react'

export interface IRouteLoadingIndicatorProps {
  children: NonNullable<ReactNode> | null
  fallback?: ReactNode
}
