import { INavLinkProps } from './types'
import { useLocation } from '../Router'
import React, { useMemo } from 'react'
import { createLocation } from 'history'
import { Link } from '../Link'
import classNames from 'classnames'
import { locationsAreEqual } from './utils'

export function NavLink(props: INavLinkProps) {
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

  return (
    <Link
      {...linkProps}
      to={targetLocation}
      className={className}
      mainRouter={false}
    />
  )
}
