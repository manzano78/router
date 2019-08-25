import { ReactNode } from 'react'

export interface IPromiseState<T> {
  result?: T
  error?: any
  isLoading: boolean
}

export interface IDeferedPromiseState<T> extends IPromiseState<T> {
  run: (...args: any[]) => Promise<T>
}
