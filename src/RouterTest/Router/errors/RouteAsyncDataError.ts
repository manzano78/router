import { RouteError } from './RouteError'
import { ComponentType } from 'react'
import { IAsyncDataErrorComponentProps } from '../types'

export class RouteAsyncDataError
  extends RouteError<IAsyncDataErrorComponentProps> {
  constructor(
    fallbackComponent: ComponentType<IAsyncDataErrorComponentProps>,
    error: any
  ) {
    super(
      'The route could not be resolved.',
      fallbackComponent,
      { error }
    )
  }
}
