import { History, Location } from 'history'

export interface IHistoryLocationState<T> {
  history: History<T>
  location: Location<T>
}
