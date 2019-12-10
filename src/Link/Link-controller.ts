import { ILinkProps } from './Link-types'
import { useIsInModal } from '../IsInModalContext'
import { useHistory, useMainHistory } from '../HistoryContext'
import { useCallback, useMemo } from 'react'
import { isString } from 'ts-util-is'
import { createLocation, Path } from 'history'
import React from 'react'
import { isModifiedEvent } from './Link-utils'
import { useCloseModal } from '../ModalContext'

export function useController(props: ILinkProps) {
  const {
    to: targetLocation,
    target = '_self',
    isDisabled = false,
    onClick: handleProvidedClickHandler,
    ...linkProps
  } = props
  const isInModal = useIsInModal()
  const history = useHistory()
  const mainHistory = useMainHistory()
  const closeModal = useCloseModal()
  const href = useMemo(() => {
    if (isDisabled || (isInModal && target === '_self')) {
      return undefined
    }

    const effectiveTargetLocation = isString(targetLocation)
      ? createLocation(targetLocation)
      : targetLocation

    return mainHistory.createHref(effectiveTargetLocation)
  }, [targetLocation, mainHistory, isInModal, isDisabled, target])

  const onClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (isDisabled) {
        event.preventDefault()
      }

      if (handleProvidedClickHandler) {
        handleProvidedClickHandler(event)
      }

      if (!event.defaultPrevented) {
        if (isInModal && target === '_self') {
          event.preventDefault()

          if (event.button === 0 && !isModifiedEvent(event)) {
            history.push(targetLocation as Path)
          }
        } else if (
          event.button === 0 &&
          target !== '_blank' &&
          !isModifiedEvent(event)
        ) {
          event.preventDefault()
          mainHistory.push(targetLocation as Path)

          if (isInModal) {
            closeModal()
          }
        }
      }
    },
    [
      history,
      mainHistory,
      isInModal,
      target,
      isDisabled,
      targetLocation,
      handleProvidedClickHandler,
      closeModal
    ]
  )

  return {
    linkProps: {
      ...linkProps,
      target,
      href,
      onClick
    }
  }
}
