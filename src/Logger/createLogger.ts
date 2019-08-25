import { ALL, ERROR, INFO, LOG, OFF, TRACE, WARN } from './constants'
import { IAppender, ILogger, TAppenderType, TLevel, TLevelWeights } from './types'

const LEVEL_WEIGHTS: TLevelWeights = {
  [ALL]: 0,
  [TRACE]: 0,
  [LOG]: 1,
  [INFO]: 2,
  [WARN]: 3,
  [ERROR]: 4,
  [OFF]: 5
}

export function createLogger(...appenders: IAppender[]): ILogger {
  const log = (level: TLevel, message: string) => {
    appenders.forEach(({ logger, getLevel: getThreshold }) => {
      const threshold = getThreshold()

      if (levelIsGreaterThanOrEqualThreshold(level, threshold)) {
        logger(level, message, Date.now())
      }
    })
  }

  return {
    getAppender: (appenderType?: TAppenderType) => {
      if (appenderType) {
        const [appender] = appenders.filter(({ type }) => type ===appenderType)

        if (appender) {
          return appender
        }

        throw new Error(`Could not find an appender of type "${appenderType}".`)
      }

      if (appenders.length === 1) {
        return appenders[0]
      }

      throw new Error('Could not find a unique appender.')
    },
    trace: (message: string) => {
      log(TRACE, message)
    },
    log: (message: string) => {
      log(LOG, message)
    },
    info: (message: string) => {
      log(INFO, message)
    },
    warning: (message: string) => {
      log(WARN, message)
    },
    error: (message: string, error?: Error) => {
      log(ERROR, message)

      if (error instanceof Error) {
        log(ERROR, error.message)
      }
    }
  }
}

function levelIsGreaterThanOrEqualThreshold(
  levelToTest: TLevel,
  thresholdLevel: TLevel
) {
  return getLevelWeight(levelToTest) >= getLevelWeight(thresholdLevel)
}

function getLevelWeight(level: TLevel) {
  return LEVEL_WEIGHTS[level]
}
