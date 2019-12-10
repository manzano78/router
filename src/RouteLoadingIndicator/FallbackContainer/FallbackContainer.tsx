import React from 'react'
import { IFallbackContainerProps } from './FallbackContainer-types'
import { useController } from './FallbackContainer-controller'

export function FallbackContainer(props: IFallbackContainerProps) {
  const { children } = useController(props)

  return <>{children}</>
}
