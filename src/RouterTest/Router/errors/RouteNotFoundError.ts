import { ComponentType } from 'react'
import { RouteError } from './RouteError'

export class RouteNotFoundError extends RouteError<{}> {
  constructor(fallbackComponent: ComponentType<{}>) {
    super('The route could not be found.', fallbackComponent, {})
  }
}
