import { LocationDescriptor, MemoryHistory } from 'history'
import { ReactNode } from 'react'
import { IModalOptions } from '../ModalOptionsContext'

export interface IModalContext {
  openModal(
    initialLocation: LocationDescriptor,
    specificModalOptions?: IModalOptions,
    onClose?: (...args: any[]) => void
  ): void
  closeModal(...args: any[]): void
  modal?: IModal
}

export interface IModal {
  history: MemoryHistory
  specificOptions?: IModalOptions
  onClose?: (...args: any[]) => void
  closingArgs?: any[]
}

export interface IModalContextProviderProps {
  getConfirmation?(message: string, callback: (result: boolean) => void): void
  children?: ReactNode | ((modalContext: IModalContext) => ReactNode)
}
