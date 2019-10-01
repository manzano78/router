import { ILinkProps } from './types'
import { useHistory, useIsInModal } from '../Router'
import React, { useCallback, useMemo } from 'react'
import { isModifiedEvent } from './utils'
import { isString } from 'ts-util-is'
import { createLocation, Path } from 'history'
import { useMainHistory } from '../Router/Router'

export function Link(props: ILinkProps) {
  const {
    target,
    to: targetLocation,
    isDisabled = false,
    mainRouter = false,
    onClick: handleProvidedClickHandler,
    ...linkProps
  } = props
  const isInModal = useIsInModal()
  const relativeHistory = useHistory()
  const mainHistory = useMainHistory()
  const history = useMemo(
    () => mainRouter ? mainHistory : relativeHistory,
    [mainHistory, relativeHistory, mainRouter]
  )

  const href = useMemo(() => {
    if (isDisabled || isInModal) {
      return
    }

    const effectiveTargetLocation = isString(targetLocation)
      ? createLocation(targetLocation)
      : targetLocation

    return history.createHref(effectiveTargetLocation)
  }, [targetLocation, history, isInModal, isDisabled])

  const onClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (isDisabled) {
        event.preventDefault()
      }

      if (handleProvidedClickHandler) {
        handleProvidedClickHandler(event)
      }

      if (!event.defaultPrevented) {
        if (isInModal) {
          event.preventDefault()

          if (event.button === 0 && !isModifiedEvent(event)) {
            history.push(targetLocation as Path)
          }
        } else if (event.button === 0 && !target && !isModifiedEvent(event)) {
          event.preventDefault()
          history.push(targetLocation as Path)
        }
      }
    },
    [
      history,
      isInModal,
      target,
      isDisabled,
      targetLocation,
      handleProvidedClickHandler
    ]
  )

  return <a {...linkProps} target={target} href={href} onClick={onClick} />
}
