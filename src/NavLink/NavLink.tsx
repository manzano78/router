import { INavLinkProps } from './NavLink-types'
import React from 'react'
import { Link } from '../Link'
import { useController } from './NavLink-controller'

export function NavLink(props: INavLinkProps) {
  const { linkProps } = useController(props)

  return <Link {...linkProps} />
}
