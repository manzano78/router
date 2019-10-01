import { ReactNode } from 'react'

export interface IRouteProps {
  loadingView?: ReactNode | ((currentView: ReactNode) => ReactNode)
}

export type TIsLoadingNextRoute = boolean
