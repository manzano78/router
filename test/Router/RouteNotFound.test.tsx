import React from 'react'
import { History } from 'history'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import { Route, Router } from '../../src'
import { createMemoryHistory } from 'history'
import { IRouteConfig} from '../../src/types'
import { TFallbackOrGetFallback } from '../../src/types'

describe('Route not found scenarios', () => {

  let history: History
  const validLocationFlag = 'test'
  const fallbackLocation = '/fallbackLocation'
  const fallbackRoute: IRouteConfig = {
    pathPattern: fallbackLocation,
    component: () => <div data-testid={validLocationFlag} />
  }
  const FallbackView = () => (
    <div data-testid={validLocationFlag} />
  )

  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: ['/initialLocation'],
      initialIndex: 0
    })
  })

  const testScenario = async (
    onRouteNotFound: TFallbackOrGetFallback | undefined,
    routes: IRouteConfig[]
  ) => {
    const { findByTestId, findByText } = render(
      <Router
        defaultHasAccess
        history={history}
        routes={routes}
        onRouteNotFound={onRouteNotFound}
      >
        <Route />
      </Router>
    )

    if (onRouteNotFound) {
      await findByTestId(validLocationFlag)
    } else {
      await findByText('Page not found')
    }
  }

  it('should redirect to a specific location on route not found (1)', async () => {
    await testScenario({ redirectTo: fallbackLocation}, [fallbackRoute])
  })

  it('should redirect to a specific location on route not found (2)', async () => {
    await testScenario(() => ({ redirectTo: fallbackLocation }), [fallbackRoute])
  })

  it('should display a specific view on route not found (1)', async () => {
    await testScenario({ display: FallbackView }, [])
  })

  it('should display a specific view on route not found (2)', async () => {
    await testScenario(() => ({ display: FallbackView }), [])
  })

  it('should display the default specific view on route not found', async () => {
    await testScenario(undefined, [])
  })
})
