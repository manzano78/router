import { ILinkProps } from './Link-types'
import React from 'react'
import { useController } from './Link-controller'

export function Link(props: ILinkProps) {
  const { linkProps } = useController(props)

  return <a {...linkProps} />
}
