import React from 'react'

export function isModifiedEvent(event: React.MouseEvent<HTMLAnchorElement>) {
  const { metaKey, altKey, ctrlKey, shiftKey } = event

  return metaKey || altKey || ctrlKey || shiftKey
}
