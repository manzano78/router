import { IAppender, TAppenderType, TLevel, TLogger } from './types'

export function createAppender (
  type: TAppenderType,
  initialLevel: TLevel,
  logger: TLogger,
  onLevelChange?: (newlevel: TLevel, oldLevel: TLevel) => void
): IAppender {
  let level = initialLevel
  return {
    type,
    logger,
    getLevel: () => level,
    setLevel: (newLevel: TLevel) => {
      const oldLevel = level

      level = newLevel

      if (onLevelChange) {
        onLevelChange(newLevel, oldLevel)
      }
    }
  }
}
