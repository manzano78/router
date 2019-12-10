import { IRouterProps } from '../Router'
import { MemoryHistoryBuildOptions } from 'history'

export type TMemoryRouterProps = Omit<IRouterProps, 'history'> &
  MemoryHistoryBuildOptions
