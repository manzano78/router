import { ComponentType } from 'react'

export interface IRouteParams {
  [param: string]: string
}

export interface IBreadcrumbItemProps {
  path: string
  isLast: boolean
  data: any
}

export interface IBreadcrumbItem extends IBreadcrumbItemProps {
  component: ComponentType<IBreadcrumbItemProps>
}

export type TBreadcrumb = IBreadcrumbItem[]

export interface IRoute {
  params: IRouteParams
  breadcrumb: TBreadcrumb
  component: ComponentType<{}>
  placeholderComponent?: ComponentType<{}>
  data?: any
  meta?: any
}
