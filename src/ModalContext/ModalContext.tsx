import React from 'react'
import { IModalContext, IModalContextProviderProps } from './ModalContext-types'
import { useController } from './ModalContext-controller'
import { createContext } from '@manzano/component-utils'

const [ModalContextProvider, useModalContext] = createContext<IModalContext>()

export function ModalProvider(props: IModalContextProviderProps) {
  const { children, getConfirmation } = props
  const { modalContext } = useController(getConfirmation)

  return (
    <ModalContextProvider value={modalContext}>{children}</ModalContextProvider>
  )
}

export function useCloseModal() {
  const { closeModal } = useModalContext()

  return closeModal
}

export function useOpenModal() {
  const { openModal } = useModalContext()

  return openModal
}

export function useIsModalOpen() {
  const { modal } = useModalContext()

  return !!modal
}
