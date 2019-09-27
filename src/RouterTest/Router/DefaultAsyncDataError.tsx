import React, { useMemo } from 'react'
import { IAsyncDataErrorComponentProps } from './types'

export function DefaultAsyncDataError({ error }: IAsyncDataErrorComponentProps) {
  const detail = useMemo(
    () => {
      if (error instanceof Error) {
        return error.stack || error.message
      }

      return error != null ? error.toString() : null
    },
    [error]
  )

  return (
    <div>
      <h1>An error occurred while resolving the route async data{detail && ':'}</h1>
      {detail && (
        <p>{detail}</p>
      )}
    </div>
  )
}
