import {
  IMainRouter,
  IModalRouter,
  TListener
} from './types'
import { SetStateAction } from 'react'
import { isFunction } from 'ts-util-is'

export function isMainRouter(
  router: IMainRouter | IModalRouter
): router is IMainRouter {
  return !!(router as IMainRouter).openModal
}

export function isModalRouter(
  router: IMainRouter | IModalRouter
): router is IModalRouter {
  return !isMainRouter(router)
}

export function createValueObserver<T>(initialValue: T) {
  let value = initialValue
  const listeners = new Set<TListener>()

  const notifyListeners = () => {
    listeners.forEach((notifyListener) => {
      notifyListener()
    })
  }

  return {
    getValue: () => value,
    setValue: (newValue: SetStateAction<T>) => {
      const effectiveNewValue = isFunction(newValue)
        ? newValue(value)
        : newValue

      if (effectiveNewValue !== value) {
        value = effectiveNewValue

        notifyListeners()
      }
    },
    listen: (listener: TListener) => {
      listeners.add(listener)

      return () => {
        listeners.delete(listener)
      }
    }
  }
}
