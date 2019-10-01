import { TFallbackOrGetFallback } from './types'
import { IErrorSuggestingFallbackView, IErrorSuggestingRedirection } from './types'
import { isFunction } from 'ts-util-is'
import { isDefaultRedirectionFallback } from './Router/utils'

export function createRouteError(
  fallbackOrGetFallback: TFallbackOrGetFallback,
  reloadFully: () => void,
  reload: () => void = reloadFully,
): IErrorSuggestingRedirection | IErrorSuggestingFallbackView {
  const fallback = isFunction(fallbackOrGetFallback)
    ? fallbackOrGetFallback()
    : fallbackOrGetFallback

  if (isDefaultRedirectionFallback(fallback)) {
    return { isRouteError: true, redirection: fallback.redirectTo }
  }

  return {
    isRouteError: true,
    fallbackRoute: {
      reload,
      reloadFully,
      params: {},
      data: {},
      meta: {},
      breadcrumb: [],
      component: fallback.display
    }
  }
}
