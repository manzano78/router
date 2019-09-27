import { IMainRouter, IModalRouter, IRouterOptions, TOnModalClose } from '../types'
import { History, LocationDescriptor } from 'history'
import { createValueObserver } from '../utils'
import { createRouteObserver } from './createRouteObserver'
import { createModalRouter } from './createModalRouter'
import { startRouter, stopRouter } from './routerStarter'

export function createMainRouter(
  history: History,
  options: IRouterOptions
): IMainRouter {
  const {
    getValue: getModalRouter,
    setValue: setModalRouter,
    listen: listenToModalRouter
  } = createValueObserver<null | IModalRouter>(null)
  const {
    getRouteState,
    listenToRouteState,
    setRouteState
  } = createRouteObserver()
  const openModal = (
    initialLocation: LocationDescriptor,
    onModalClose?: TOnModalClose
  ) => {
    if (!getModalRouter()) {
      const modalRouter = createModalRouter(
        mainRouter,
        initialLocation,
        onModalClose,
        () => setModalRouter(null)
      )

      setModalRouter(modalRouter)
      startRouter(modalRouter, options)
    }
  }

  const start = () => {
    startRouter(mainRouter, options)

    return () => {
      const modalRouter = mainRouter.getModalRouter()

      stopRouter(mainRouter)

      if (modalRouter) {
        stopRouter(modalRouter)
      }
    }
  }

  const mainRouter: IMainRouter = {
    history,
    getModalRouter,
    listenToModalRouter,
    setRouteState,
    getRouteState,
    listenToRouteState,
    openModal,
    start
  }

  return mainRouter
}
