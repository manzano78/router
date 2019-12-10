import { IRouterProps } from '../Router'
import { HashHistoryBuildOptions } from 'history'

export type THashRouterProps = Omit<IRouterProps, 'history'> &
  HashHistoryBuildOptions
