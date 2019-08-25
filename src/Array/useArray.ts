import { useRef, useState } from 'react'
import { isFunction } from 'ts-util-is'

export function useArray<T>(initialValue: T[] | (() => T[])) {
  const [array, setArray] = useState((): ReadonlyArray<T> => {
    return isFunction(initialValue) ? initialValue() : initialValue
  })

  const { current: push } = useRef((...values: T[]) => {
    setArray((array) => [...array, ...values])
  })

  const { current: unshift } = useRef((...values: T[]) => {
    setArray((array) => [...values, ...array])
  })

  const { current: pop } = useRef(() => {
    setArray((array) => array.slice(1))
  })

  const { current: sort } = useRef((compareFn?: (a: T, b: T) => number) => {
    setArray((array) => {
      const arrayCopy = [...array]

      arrayCopy.sort(compareFn)

      return arrayCopy
    })
  })

  const { current: swap } = useRef((i: number, j: number) => {
    setArray((array) => {
      const arrayCopy = [...array]
      const temp = arrayCopy[i]

      arrayCopy[i] = arrayCopy[j]
      arrayCopy[j] = temp

      return arrayCopy
    })
  })
}

[].sort()