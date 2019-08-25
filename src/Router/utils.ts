import { useRef } from 'react'
import { isDefined } from 'ts-util-is'
import { IDefaultComponent, IDefaultRedirection, TOnRouteNotFound } from './types'

const INITIAL_VALUE = Symbol('Initial value')

export function useExpensive<T>(initValue: () => T) {
  const valueRef = useRef<T | typeof INITIAL_VALUE>(INITIAL_VALUE)

  if (valueRef.current === INITIAL_VALUE) {
    valueRef.current = initValue()
  }

  return valueRef.current
}

export function isDefaultComponentToDisplay(
  onRouteNotFound: TOnRouteNotFound
): onRouteNotFound is IDefaultComponent {
  return isDefined((onRouteNotFound as IDefaultComponent).display)
}

export function isDefaultRedirectionToMake(
  onRouteNotFound: TOnRouteNotFound
): onRouteNotFound is IDefaultRedirection {
  return isDefined((onRouteNotFound as IDefaultRedirection).redirectTo)
}
