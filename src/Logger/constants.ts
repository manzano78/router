import { TLevel, TLevelWeights, TMessageFormatter } from './types'

export const ALL = 'ALL'
export const TRACE = 'TRACE'
export const LOG = 'LOG'
export const INFO = 'INFO'
export const WARN = 'WARN'
export const ERROR = 'ERROR'
export const OFF = 'OFF'

export const LEVEL_WEIGHTS: TLevelWeights = {
  [ALL]: 0,
  [TRACE]: 0,
  [LOG]: 1,
  [INFO]: 2,
  [WARN]: 3,
  [ERROR]: 4,
  [OFF]: 5,
}

export const DEFAULT_MESSAGE_FORMATTER: TMessageFormatter = (
  level: TLevel,
  message: string,
  timestamp: number
) => `[${level}]: ${timestamp} ; ${message}`
