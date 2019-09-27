import { ILinkProps } from '../Link'
import { Location } from 'history'

export interface INavLinkProps extends ILinkProps {
  activeClassName?: string
  isActive?: (params: IIsActiveParam) => boolean
}

export interface IIsActiveParam {
  currentLocation: Location
  isCurrentLocation: boolean
}
