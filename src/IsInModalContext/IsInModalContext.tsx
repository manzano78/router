import React from 'react'
import { IIsInModalProviderProps } from './IsInModalContext-types'
import { createContext } from '@manzano/component-utils'

const [IsInModalContextProvider, useIsInModal] = createContext(false)

function IsInModalProvider({ children }: IIsInModalProviderProps) {
  return (
    <IsInModalContextProvider value={true}>{children}</IsInModalContextProvider>
  )
}

export { IsInModalProvider, useIsInModal }
