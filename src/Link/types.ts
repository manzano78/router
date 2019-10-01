import { LocationDescriptor } from 'history'
import { AnchorHTMLAttributes } from 'react'
import { Omit } from 'yargs'

export interface ILinkProps {
  to: LocationDescriptor
  isDisabled?: boolean
  mainRouter?: boolean
  [p: string]: any
}
