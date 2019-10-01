import { ICancellation} from '../types'
import noop from 'noop-ts'
import { DefaultAsyncDataError } from './DefaultAsyncDataError'
import { DefaultPageNotFound } from './DefaultPageNotFound'
import { DefaultAccessDenied } from './DefaultAccessDenied'
import { IDefaultDisplay, IErrorProps } from '../types'

export const DEFAULT_ON_ROUTE_NOT_FOUND: IDefaultDisplay = {
  display: DefaultPageNotFound
}
export const DEFAULT_ON_ACCESS_DENIED: IDefaultDisplay = {
  display: DefaultAccessDenied
}
export const DEFAULT_ON_ASYNC_ERROR: IDefaultDisplay<IErrorProps> = {
  display: DefaultAsyncDataError
}
export const DEFAULT_CANCELLATION_SYSTEM = (): ICancellation => ({
  cancel: noop,
  signal: null
})
