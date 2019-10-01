import React, { ReactNode, useEffect, useMemo } from 'react'
import noop from 'noop-ts'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, findByText, getByTestId } from '@testing-library/react'
import { Route, Router, useHistory, useLocation } from '../../src'
import { createMemoryHistory } from 'history'
import { IRouteConfig } from '../../src/types'

describe('Route loading tests', () => {
  it('should display a specific view when the next route is loading', async () => {
    const currentPath = '/test'
    const history = createMemoryHistory({
      initialEntries: [currentPath],
      initialIndex: 0
    })
    const routes: IRouteConfig[] = [
      {
        pathPattern: currentPath,
        routeAsyncData: () => new Promise(noop),
        component: () => null
      }
    ]
    const validLoadingFlag = 'validLoadingFlag'
    const loadingView = <div data-testid={validLoadingFlag} />

    const { findByTestId } = render(
      <Router
        defaultHasAccess
        history={history}
        routes={routes}
      >
        <Route loadingView={loadingView} />
      </Router>
    )

    await findByTestId(validLoadingFlag)
  })

  it('should display the current route view when the next route is loading', async () => {
    const currentPath = '/currentPath'
    const nextPath = '/nextPath'
    const validLoadingFlag = 'validLoadingFlag'
    const history = createMemoryHistory({
      initialEntries: [currentPath],
      initialIndex: 0
    })
    const routes: IRouteConfig[] = [
      {
        pathPattern: currentPath,
        component: () => {
          const history = useHistory()
          const location = useLocation()

          useEffect(() => {
            history.push(nextPath)
          }, [])

          return (
            <>
              {location.pathname === nextPath && <div data-testid={validLoadingFlag} />}
            </>
          )
        }
      },
      {
        pathPattern: nextPath,
        routeAsyncData: () => new Promise(noop),
        component: () => null
      }
    ]

    const { findByTestId } = render(
      <Router
        defaultHasAccess
        history={history}
        routes={routes}
      >
        <Route />
      </Router>
    )

    await findByTestId(validLoadingFlag)
  })

  it('should display the current route view when the next route is loading', async () => {
    const currentPath = '/currentPath'
    const nextPath = '/nextPath'
    const validLoadingFlag = 'validLoadingFlag'
    const currentViewContent = 'Some random text'
    const history = createMemoryHistory({
      initialEntries: [currentPath],
      initialIndex: 0
    })
    const routes: IRouteConfig[] = [
      {
        pathPattern: currentPath,
        component: () => {
          const history = useHistory()

          useEffect(() => {
            history.push(nextPath)
          }, [])

          return <>{currentViewContent}</>
        }
      },
      {
        pathPattern: nextPath,
        routeAsyncData: () => new Promise(noop),
        component: () => null
      }
    ]

    const loadingView = (currentView: ReactNode) => (
      <div data-testid={validLoadingFlag}>
        {currentView}
      </div>
    )

    const { findByTestId } = render(
      <Router
        defaultHasAccess
        history={history}
        routes={routes}
      >
        <Route loadingView={loadingView} />
      </Router>
    )

    const container = await findByTestId(validLoadingFlag)

    expect(container).toHaveTextContent(currentViewContent)

  })
})
