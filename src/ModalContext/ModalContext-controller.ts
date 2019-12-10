import { IModal, IModalContext } from './ModalContext-types'
import { createMemoryHistory, LocationDescriptor } from 'history'
import { useEffect, useMemo, useState } from 'react'
import { usePrevious } from '@manzano/component-utils'
import { IModalOptions } from '../ModalOptionsContext/ModalOptionsContext-types'

export function useController(
  getUserConfirmation?: (
    message: string,
    callback: (result: boolean) => void
  ) => void
) {
  const [modal, setModal] = useState<IModal | undefined>(undefined)
  const previousModal = usePrevious(modal)

  const modalContext = useMemo(
    (): IModalContext => ({
      modal,
      openModal: (
        initialLocation: LocationDescriptor,
        specificOptions?: IModalOptions,
        onClose?: (...args: any[]) => void
      ) => {
        setModal(
          (modal) =>
            modal || {
              onClose,
              specificOptions,
              history: createMemoryHistory({
                getUserConfirmation,
                initialEntries: [initialLocation as string],
                initialIndex: 0
              })
            }
        )
      },
      closeModal: (...closingArgs: any[]) => {
        if (modal) {
          if (modal.onClose && !modal.closingArgs) {
            modal.closingArgs = closingArgs
          }

          setModal(undefined)
        }
      }
    }),
    [modal, getUserConfirmation]
  )

  useEffect(() => {
    if (previousModal && previousModal.onClose && !modal) {
      previousModal.onClose(...previousModal.closingArgs!)
    }
  }, [modal, previousModal])

  return { modalContext }
}
