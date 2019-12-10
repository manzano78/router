import { History, Location } from 'history'
import { createContext } from '@manzano/component-utils'
import { useEffect, useState } from 'react'
import { IHistoryLocationState } from './HistoryContext-types'

const [MainHistoryProvider, useMainHistory] = createContext<History>()
const [HistoryProvider, useHistory] = createContext<History>()

function useMainLocation() {
  const history = useMainHistory()

  return useHistoryLocation(history)
}

function useLocation() {
  const history = useHistory()

  return useHistoryLocation(history)
}

function useHistoryLocation<T>(historyInstance: History<T>) {
  const [{ history, location }, setState] = useState(
    (): IHistoryLocationState<T> => {
      const { location } = historyInstance

      return { history: historyInstance, location }
    }
  )

  if (history !== historyInstance) {
    const { location } = historyInstance

    setState({ history: historyInstance, location })
  }

  useEffect(() => {
    const updateLocation = (location: Location<T>) => {
      setState((state) => {
        return state.history === history ? { history, location } : state
      })
    }

    const stopListening = history.listen(updateLocation)

    updateLocation(history.location)

    return stopListening
  }, [history])

  return location
}

export {
  MainHistoryProvider,
  HistoryProvider,
  useMainHistory,
  useHistory,
  useMainLocation,
  useLocation
}
