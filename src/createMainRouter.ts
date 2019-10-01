import { BehaviorSubject } from 'rxjs'
import {
  History,
  LocationDescriptor,
} from 'history'
import { IMainRouter, IModalOptions, IModalRouter, IRouterOptions } from './types'
import { getConfirmation } from 'history/DOMUtils'
import {
  TOnModalClose
} from './types'
import { listenToObservable } from './utils'
import { createModalRouter } from './createModalRouter'
import { createRouter } from './createRouter'

export function createMainRouter(
  history: History,
  options: IRouterOptions,
  defaultModalOptions: IModalOptions = {},
  modalHistoryUserConfirmation?: typeof getConfirmation
) {
  const modalRouter$ = new BehaviorSubject<IModalRouter | null>(null)

  const getOptions = () => options

  const closeModalSilently = () => {
    handleModalClosing(false)
  }

  const handleModalClosing = (
    callOnModalCloseCallbackIfAny: boolean,
    ...onModalCloseArgs: any[]
  ) => {
    const { value: modalRouter } = modalRouter$

    if (modalRouter) {
      modalRouter.stop()
      modalRouter$.next(null)

      if (callOnModalCloseCallbackIfAny && modalRouter.onModalClose) {
        modalRouter.onModalClose(...onModalCloseArgs)
      }
    }
  }

  const getModalRouter = () => modalRouter$.value

  const enhancement = {
    options,
    defaultModalOptions,
    modalHistoryUserConfirmation,
    getModalRouter,
    get isModalOpen() {
      return !!getModalRouter()
    },
    listenToModalRouter: (listener: (modalRouter: IModalRouter | null) => void) =>
      listenToObservable(modalRouter$, listener),
    openModal: (
      initialLocation: LocationDescriptor,
      modalOptions: IModalOptions = mainRouter.defaultModalOptions,
      onModalClose?: TOnModalClose
    ) => {
      if (!mainRouter.isModalOpen) {
        const effectiveOnModalClose = (...args: any[]) => {
          modalRouter$.next(null)

          if (onModalClose) {
            onModalClose(...args)
          }
        }
        const effectiveModalOptions =
          modalOptions !== mainRouter.defaultModalOptions
            ? { ...mainRouter.defaultModalOptions, ...modalOptions }
            : modalOptions

        const modalRouter = createModalRouter(
          mainRouter,
          initialLocation,
          effectiveModalOptions,
          effectiveOnModalClose
        )

        modalRouter.start()
        modalRouter$.next(modalRouter)
      }
    },
    closeModal: (...args: any[]) => {
      handleModalClosing(true, ...args)
    },
    closeModalSilently
  }

  const mainRouter: IMainRouter = createRouter(
    history,
    getOptions,
    enhancement,
    closeModalSilently
  )

  return mainRouter
}
