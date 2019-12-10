import { LocationDescriptor } from 'history'

export interface ILinkProps {
  to: LocationDescriptor
  isDisabled?: boolean
  target?: '_blank' | '_self' | '_parent' | '_top'
  [p: string]: any
}
