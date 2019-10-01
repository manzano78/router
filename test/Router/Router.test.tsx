import React, { useEffect } from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, findByText, getByTestId } from '@testing-library/react'
import { ModalContainer, Route, Router, useHistory, useOpenModal, useRoute } from '../../src'
import { createMemoryHistory } from 'history'
import { IRouteConfig } from '../../src/types'

describe('Router tests', () => {
  it.skip('should get history', async () => {
    const history = createMemoryHistory()
    const mainHistoryAcceptanceId = 'mainHistory'
    const modalHistoryAcceptanceId = 'modalHistory'

    const MainHistoryContainer = () => {
      const relativeHistory = useHistory()
      const openModal = useOpenModal()

      useEffect(() => {
        openModal('/test')
      }, [])

      return (
        <>
          {relativeHistory === history && <div data-testid={mainHistoryAcceptanceId}/>}
        </>
      )
    }

    const ModalHistoryContainer = () => {
      const relativeHistory = useHistory()

      return (
        <>
          {relativeHistory !== history && <div data-testid={modalHistoryAcceptanceId}/>}
        </>
      )
    }

    const { findByTestId } = render(
      <Router
        history={history}
        routes={[]}
      >
        <MainHistoryContainer />
        <ModalContainer>
          <ModalHistoryContainer />
        </ModalContainer>
      </Router>
    )

    await Promise.all([
      findByTestId(mainHistoryAcceptanceId),
      findByTestId(modalHistoryAcceptanceId),
    ])
  })

  it.skip('should display a route presenting data from params and async data', async () => {
    const containerId = 'container'
    const jamesBond = 'James Bond'
    const job = 'Agent'
    const agentCode = '007'
    const currentPath = '/test/:name'
    const dateResolvingArg = {
      getJobName: () => Promise.resolve(job)
    }
    const routes: IRouteConfig[] = [{
      pathPattern: currentPath,
      hasAccess: () => true,
      routeAsyncData: async (params, { getJobName }) => {
        const job = await getJobName()

        return { job, agentCode: params.name === jamesBond && agentCode }
      },
      component: () => {
        const [{ params, data }] = useRoute()
        const { job, agentCode } = data

        return (
          <div data-testid={containerId}>{job} {params.name} {agentCode}</div>
        )
      }
    }]

    const history = createMemoryHistory({
      initialEntries: [`/test/${jamesBond}`],
      initialIndex: 0
    })

    const { findByTestId } = render(
      <Router
        history={history}
        routes={routes}
        dataResolvingArg={dateResolvingArg}
      >
        <Route/>
      </Router>
    )

    const container = await findByTestId(containerId)

    expect(container).toHaveTextContent(`${job} ${jamesBond} ${agentCode}`)
  })
})
