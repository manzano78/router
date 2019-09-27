import { ComponentType } from 'react'
import { RouteError } from './RouteError'

export class RouteAccessDeniedError extends RouteError<{}> {
  constructor(fallbackComponent: ComponentType<{}>) {
    super(
      'The route could not be accessed because of insufficient privileges.',
      fallbackComponent,
      {}
    )
  }
}
