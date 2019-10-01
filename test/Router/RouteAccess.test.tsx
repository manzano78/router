import React, { useEffect } from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, findByText, getByTestId } from '@testing-library/react'
import { ModalContainer, Route, Router, useHistory, useOpenModal, useRoute } from '../../src'
import { createMemoryHistory, History } from 'history'
import { IRouteConfig} from '../../src/types'
import { TFallbackOrGetFallback } from '../../src/types'

describe('Route access scenarios', () => {
  let history: History
  const flagEnsuringAccessPermitted = 'accessPermitted'
  const flagEnsuringAccessDenied = 'accessDenied'
  const fallbackLocation = '/fallbackLocation'
  const fallbackRoute: IRouteConfig = {
    pathPattern: fallbackLocation,
    component: () => <div data-testid={flagEnsuringAccessDenied} />
  }
  const FallbackView = () => (
    <div data-testid={flagEnsuringAccessDenied} />
  )

  const testScenario = async (
    defaultHasAccess: boolean | undefined,
    hasAccessInheritance: boolean | undefined,
    onAccessDenied: TFallbackOrGetFallback | undefined,
    accessArg: any,
    routes: IRouteConfig[],
    flagThatHasToBePresent: string
  ) => {
    const { findByTestId } = render(
      <Router
        history={history}
        routes={routes}
        accessArg={accessArg}
        defaultHasAccess={defaultHasAccess}
        onAccessDenied={onAccessDenied}
      >
        <Route />
      </Router>
    )

    await findByTestId(flagThatHasToBePresent)
  }

  const createRoutes = (
    firstPathAccessGetter?: (accessArg: any) => boolean,
    secondPathAccessGetter?: (accessArg: any) => boolean,
  ) => [
    {
      pathPattern: '/firstPath',
      hasAccess: firstPathAccessGetter,
      component: () => null,
      subRoutes: [
        {
          pathPattern: '/secondPath',
          hasAccess: secondPathAccessGetter,
          component: () => <div data-testid={flagEnsuringAccessPermitted} />
        }
      ]
    }
  ]

  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: ['/firstPath/secondPath'],
      initialIndex: 0
    })
  })

  it('should have access (1)', async () => {
    const routes = createRoutes()

    await testScenario(
      true,
      true,
      undefined,
      undefined,
      routes,
      flagEnsuringAccessPermitted
    )
  })

  it('should have access (2)', async () => {
    const routes = createRoutes()

    await testScenario(
      true,
      undefined,
      undefined,
      undefined,
      routes,
      flagEnsuringAccessPermitted
    )
  })

  it('should have access (3)', async () => {
    const routes = createRoutes(
      () => true,
      () => true
    )

    await testScenario(
      true,
      undefined,
      undefined,
      undefined,
      routes,
      flagEnsuringAccessPermitted
    )
  })

  it('should have access (4)', async () => {
    const routes = createRoutes(
      () => true
    )

    await testScenario(
      true,
      undefined,
      undefined,
      undefined,
      routes,
      flagEnsuringAccessPermitted
    )
  })

  it('should have access (5)', async () => {
    const routes = createRoutes(
      () => true,
      () => true
    )

    await testScenario(
      true,
      true,
      undefined,
      undefined,
      routes,
      flagEnsuringAccessPermitted
    )
  })

  it('should have access (6)', async () => {
    const routes = createRoutes(
      () => true
    )

    await testScenario(
      true,
      true,
      undefined,
      undefined,
      routes,
      flagEnsuringAccessPermitted
    )
  })

  it('should have access (7)', async () => {
    const routes = createRoutes(
      () => true
    )

    await testScenario(
      true,
      false,
      undefined,
      undefined,
      routes,
      flagEnsuringAccessPermitted
    )
  })
})
