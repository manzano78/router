import { IMainRouter, IModalRouter, TOnModalClose } from '../types'
import { createMemoryHistory, LocationDescriptor } from 'history'
import { createRouteObserver } from './createRouteObserver'
import { stopRouter } from './routerStarter'

export function createModalRouter(
  mainRouter: IMainRouter,
  initialLocation: LocationDescriptor,
  onModalClose: TOnModalClose | undefined,
  disposeModal: () => void,
): IModalRouter {
  const {
    getRouteState,
    listenToRouteState,
    setRouteState
  } = createRouteObserver()
  const history = createMemoryHistory({
    initialEntries: [initialLocation as string],
    initialIndex: 0
  })
  const closeModal = (...args: any[]) => {
    stopRouter(modalRouter)
    disposeModal()

    if (onModalClose) {
      onModalClose(...args)
    }
  }

  const modalRouter: IModalRouter = {
    mainRouter,
    getRouteState,
    setRouteState,
    listenToRouteState,
    history,
    closeModal
  }

  return modalRouter
}
