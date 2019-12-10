import { ReactNode } from 'react'

export interface IModalOptions {
  [optionName: string]: any
}

export interface IModalOptionsProviderProps {
  baseModalOptions?: IModalOptions
  specificModalOptions?: IModalOptions
  children: (modalOptions: IModalOptions) => ReactNode
}
