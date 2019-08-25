import { get, set, remove } from 'store2'
import { isFunction } from 'ts-util-is'
import { createAppender } from './createAppender'

import { createConsoleAppender } from './createConsoleAppender'
import { IAjaxAppenderOptions, IAppender, ILog, TLevel, TLogger } from './types'

export function createAjaxAppender(options: IAjaxAppenderOptions): IAppender {
  const {
    initialLevel,
    sendLog,
    fallbackToConsoleIfFails = false,
    fallbackToLocalStorageIfFails = false,
    localStorageFallbackKey = '@@ajaxLogsInError',
    consoleFallbackMessageFormatter
  } = options

  const logsInError: ILog[] = []
  const consoleLogger = createConsoleAppender(
    initialLevel,
    consoleFallbackMessageFormatter
  )

  const persistLogToLocalStorage = (log: ILog) => {
    let logsInError = get(localStorageFallbackKey)

    if (logsInError) {
      logsInError.push(log)
    } else {
      logsInError = [log]
    }

    set(localStorageFallbackKey, logsInError)
  }

  const logger = (level: TLevel, message: string, timestamp: number) => {
    const log: ILog = { level, message, timestamp }

    sendLog(log).catch((error) => {
      if (isTrue(fallbackToConsoleIfFails, error)) {
        consoleLogger.logger(level, message, timestamp)
      }

      if (isTrue(fallbackToLocalStorageIfFails, error)) {
        persistLogToLocalStorage(log)
      }
    })
  }

  return createAppender('ajax', initialLevel, logger, (level: TLevel) => {
    consoleLogger.setLevel(level)
  })
}

function isTrue(valueToTest: boolean | ((error: Error) => boolean), error: Error) {
  return isFunction(valueToTest)
    ? valueToTest(error)
    : valueToTest
}
