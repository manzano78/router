import { ComponentType } from 'react'

export abstract class RouteError<P> extends Error {
  readonly fallbackComponent: ComponentType<P>
  readonly fallbackComponentProps: P

  protected constructor(
    message: string,
    fallbackComponent: ComponentType<P>,
    fallbackComponentProps: P
  ) {
    super(message)
    this.fallbackComponent = fallbackComponent
    this.fallbackComponentProps = fallbackComponentProps
  }
}
