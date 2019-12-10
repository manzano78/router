import { MainHistoryProvider } from '../HistoryContext'
import { ModalProvider } from '../ModalContext'
import { RouterInstance } from './RouterInstance'
import React from 'react'
import { ModalOptionsProvider } from '../ModalOptionsContext'
import { IsInModalProvider } from '../IsInModalContext'
import { IRouterProps } from './Router-types'
import { useController } from './Router-controller'

export function Router(props: IRouterProps) {
  const {
    cancellation,
    children,
    baseModalOptions,
    mainHistory,
    routes,
    dataResolvingArg,
    onRouteNotFound,
    accessArg,
    defaultHasAccess,
    hasAccessInheritance,
    ModalComponent,
    modalHistoryUserConfirmation,
    onAccessDenied
  } = useController(props)

  return (
    <MainHistoryProvider value={mainHistory}>
      <ModalProvider getConfirmation={modalHistoryUserConfirmation}>
        {({ modal }) => (
          <>
            <RouterInstance
              history={mainHistory}
              routes={routes}
              defaultHasAccess={defaultHasAccess}
              hasAccessInheritance={hasAccessInheritance}
              accessArg={accessArg}
              dataResolvingArg={dataResolvingArg}
              onAccessDenied={onAccessDenied}
              onRouteNotFound={onRouteNotFound}
              cancellation={cancellation}
            >
              {children}
            </RouterInstance>
            {ModalComponent && modal && (
              <IsInModalProvider>
                <RouterInstance
                  history={modal.history}
                  routes={routes}
                  defaultHasAccess={defaultHasAccess}
                  hasAccessInheritance={hasAccessInheritance}
                  accessArg={accessArg}
                  dataResolvingArg={dataResolvingArg}
                  onAccessDenied={onAccessDenied}
                  onRouteNotFound={onRouteNotFound}
                  cancellation={cancellation}
                >
                  <ModalOptionsProvider
                    baseModalOptions={baseModalOptions}
                    specificModalOptions={modal.specificOptions}
                  >
                    {(modalOptions) => (
                      <ModalComponent options={modalOptions} />
                    )}
                  </ModalOptionsProvider>
                </RouterInstance>
              </IsInModalProvider>
            )}
          </>
        )}
      </ModalProvider>
    </MainHistoryProvider>
  )
}
