import React, { Suspense } from 'react'
import { IBreadcrumbItemProps } from './BreadcrumbItem-types'
import { useController } from './BreadcrumbItem-controller'

export function BreadcrumbItem(props: IBreadcrumbItemProps) {
  const {
    ItemView,
    transformView,
    placeholder,
    data,
    path,
    isLast,
    index
  } = useController(props)

  let itemView = (
    <Suspense fallback={placeholder}>
      <ItemView isLast={isLast} path={path} data={data} />
    </Suspense>
  )

  if (transformView) {
    itemView = <>{transformView(itemView, isLast, index)}</>
  }

  return itemView
}
