import { IRouterProps } from '../Router'
import { BrowserHistoryBuildOptions } from 'history'

export type TBrowserRouterProps = Omit<IRouterProps, 'history'> &
  BrowserHistoryBuildOptions
