import { INavLinkProps } from './NavLink-types'
import { useMemo } from 'react'
import { locationsAreEqual } from './NavLink-utils'
import classNames from 'classnames'
import { createLocation } from 'history'
import { useLocation } from '../HistoryContext'

export function useController(props: INavLinkProps) {
  const {
    to,
    className: providedClassName,
    activeClassName = 'active',
    isActive: getIsActive,
    ...linkProps
  } = props
  const currentLocation = useLocation()
  const targetLocation = useMemo(
    () => createLocation(to, undefined, undefined, currentLocation),
    [to, currentLocation]
  )
  const isActive = useMemo(() => {
    const isCurrentLocation = locationsAreEqual(targetLocation, currentLocation)

    return getIsActive && currentLocation
      ? getIsActive({ currentLocation, isCurrentLocation })
      : isCurrentLocation
  }, [currentLocation, targetLocation, getIsActive])
  const className = useMemo(
    () =>
      classNames(providedClassName, {
        [activeClassName]: isActive
      }),
    [isActive, activeClassName]
  )

  return {
    linkProps: {
      ...linkProps,
      className,
      to: targetLocation,
      target: undefined
    }
  }
}
