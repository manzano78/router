import { IBreadcrumbProps } from './Breadcrumb-types'
import React from 'react'
import { ErrorBoundary } from '@manzano/error-boundary'
import { BreadcrumbItem } from './BreadcrumbItem'
import { useController } from './Breadcrumb-controller'

export function Breadcrumb(props: IBreadcrumbProps) {
  const {
    itemPlaceholder,
    errorFallback,
    breadcrumb,
    children
  } = useController(props)

  return (
    <ErrorBoundary fallback={errorFallback}>
      {breadcrumb.map((breadcrumbItem, breadcrumbItemIndex) => (
        <BreadcrumbItem
          key={breadcrumbItem.path}
          item={breadcrumbItem}
          itemIndex={breadcrumbItemIndex}
          itemPlaceholder={itemPlaceholder}
        >
          {children}
        </BreadcrumbItem>
      ))}
    </ErrorBoundary>
  )
}
