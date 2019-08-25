import React, { createContext, useContext } from 'react'
import { ALL } from './constants'
import { createConsoleAppender } from './createConsoleAppender'
import { createLogger } from './createLogger'
import { ILoggerProviderProps } from './types'

const defaultAppender = createConsoleAppender(ALL)
const defaultLogger = createLogger(defaultAppender)

const LoggerContext = createContext(defaultLogger)

export function LoggerProvider(props: ILoggerProviderProps) {
  const { logger, children } = props

  return (
    <LoggerContext.Provider value={logger}>
      {children}
    </LoggerContext.Provider>
  )
}

export function useLogger() {
  return useContext(LoggerContext)
}
