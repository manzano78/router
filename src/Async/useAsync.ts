import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react'
import { IDeferedPromiseState, IPromiseState } from './types'

export function useAsync<T>(
  promiseFn: () => Promise<T>
) {
  const [promiseState, setPromiseState] = usePromiseState<T>(true)

  useEffect(() => {
    promiseFn().then(
      toSuccessCallback(setPromiseState),
      toFailureCallback(setPromiseState)
    )
  }, [])

  return promiseState
}

export function useDefer<T>(
  deferFn: (...args: any[]) => Promise<T>,
  persistState = true
) {
  const [promiseState, setPromiseState] = usePromiseState<T>(false)
  const { current: run } = useRef(<T>(...args: any[]) => {
    setPromiseState((promiseState) => {
      if (persistState) {
        return promiseState.isLoading
          ? promiseState
          : { ...promiseState, isLoading: true }
      }
      return { isLoading: true }
    })

    return deferFn(...args).then(
      toSuccessCallback(setPromiseState),
      toFailureCallback(setPromiseState)
    )
  })

  return useMemo((): IDeferedPromiseState<T> => {
    return { ...promiseState, run }
  }, [promiseState])
}

export function usePromiseState<T>(isLoading: boolean) {
  return useState((): IPromiseState<T> => ({
    isLoading
  }))
}

function toSuccessCallback<T>(
  setPromiseState: Dispatch<SetStateAction<IPromiseState<T>>>,
) {
  return (result: T) => {
    setPromiseState({
      result,
      isLoading: false
    })

    return result
  }
}

function toFailureCallback<T>(
  setPromiseState: Dispatch<SetStateAction<IPromiseState<T>>>
) {
  return (error: any) => {
    setPromiseState({
      error,
      isLoading: false
    })

    throw error
  }
}
