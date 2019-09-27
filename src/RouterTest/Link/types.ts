import { LocationDescriptor } from 'history'
import { AnchorHTMLAttributes } from 'react'
import { Omit } from 'yargs'

export interface ILinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: LocationDescriptor
  isDisabled?: boolean
}
