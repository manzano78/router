import { IMainRouter, IModalOptions, IModalRouter } from './types'
import { createMemoryHistory, LocationDescriptor } from 'history'
import { TOnModalClose } from './types'
import { createRouter } from './createRouter'

export function createModalRouter(
  mainRouter: IMainRouter,
  initialLocation: LocationDescriptor,
  modalOptions: IModalOptions,
  onModalClose?: TOnModalClose
): IModalRouter {
  const { modalHistoryUserConfirmation } = mainRouter
  const history = createMemoryHistory({
    getUserConfirmation: modalHistoryUserConfirmation,
    initialEntries: [initialLocation as string],
    initialIndex: 0
  })

  const getOptions = () => mainRouter.options

  const enhancement = { mainRouter, modalOptions, onModalClose }

  return createRouter(history, getOptions, enhancement)
}
