import { ReactNode } from 'react'
import { ALL, ERROR, INFO, LOG, OFF, TRACE, WARN } from './constants'

export interface ILogger {
  getAppender: (appenderType: TAppenderType) => IAppender
  trace: (message: string) => void
  log: (message: string) => void
  info: (message: string) => void
  warning: (message: string) => void
  error: (message: string, error?: Error) => void
}

export interface ILoggerProviderProps {
  logger: ILogger
  children?: ReactNode
}

export type TLevel =
  | typeof ALL
  | typeof TRACE
  | typeof LOG
  | typeof INFO
  | typeof WARN
  | typeof ERROR
  | typeof OFF

export type TLevelWeights = {
  [level in TLevel]: number
}

export type TLogger = (
  level: TLevel,
  message: string,
  timestamp: number
) => void

export type TMessageFormatter = (
  level: TLevel,
  message: string,
  timestamp: number
) => string

export interface ILog {
  level: TLevel
  message: string
  timestamp: number
}

export interface IAjaxAppenderOptions {
  initialLevel: TLevel,
  sendLog: (log: ILog) => Promise<void>
  fallbackToConsoleIfFails?: boolean | ((error: Error) => boolean)
  consoleFallbackMessageFormatter?: TMessageFormatter
  fallbackToLocalStorageIfFails?: boolean | ((error: Error) => boolean)
  localStorageFallbackKey?: string
}

export type TAppenderType = 'console' | 'ajax'

export interface IAppender {
  type: TAppenderType
  logger: TLogger
  getLevel: () => TLevel
  setLevel: (level: TLevel) => void
}
