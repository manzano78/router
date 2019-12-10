import React from 'react'
import {
  IModalOptions,
  IModalOptionsProviderProps
} from './ModalOptionsContext-types'
import { useController } from './ModalOptionsContext-controller'
import { createContext } from '@manzano/component-utils'

const [ModalOptionsContextProvider, useModalOptions] = createContext<
  IModalOptions
>()

function ModalOptionsProvider(props: IModalOptionsProviderProps) {
  const { children, baseModalOptions, specificModalOptions } = props
  const { modalOptions } = useController(baseModalOptions, specificModalOptions)

  return (
    <ModalOptionsContextProvider value={modalOptions}>
      {children}
    </ModalOptionsContextProvider>
  )
}

export { ModalOptionsProvider, useModalOptions }
