import { DEFAULT_MESSAGE_FORMATTER, ERROR, INFO, LOG, TRACE, WARN } from './constants'
import { createAppender } from './createAppender'
import { IAppender, TLevel } from './types'

export function createConsoleAppender (
  initialLevel: TLevel,
  messageFormatter = DEFAULT_MESSAGE_FORMATTER,
  onLevelChange?: (newlevel: TLevel, oldLevel: TLevel) => void
): IAppender {
  const logger = (level: TLevel, message: string, timestamp: number) => {
    const formattedMessage = messageFormatter(level, message, timestamp)

    switch (level) {
      case TRACE:
        console.trace(formattedMessage)
        break
      case LOG:
        console.log(formattedMessage)
        break
      case INFO:
        console.info(formattedMessage)
        break
      case WARN:
        console.warn(formattedMessage)
        break
      case ERROR:
        console.error(formattedMessage)
        break
    }
  }

  return createAppender('console', initialLevel, logger, onLevelChange)
}
