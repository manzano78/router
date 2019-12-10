import { useMemo } from 'react'
import { EMPTY_MODAL_OPTIONS } from './ModalOptionsContext-constants'
import { IModalOptions } from './ModalOptionsContext-types'

export function useController(
  baseModalOptions?: IModalOptions,
  specificModalOptions?: IModalOptions
) {
  const modalOptions = useMemo((): IModalOptions => {
    if (baseModalOptions && specificModalOptions) {
      return { ...baseModalOptions, ...specificModalOptions }
    }

    if (specificModalOptions) {
      return specificModalOptions
    }

    return baseModalOptions || EMPTY_MODAL_OPTIONS
  }, [baseModalOptions, specificModalOptions])

  return { modalOptions }
}
