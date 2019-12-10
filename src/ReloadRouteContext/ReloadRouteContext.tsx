import { createContext } from '@manzano/component-utils'

const [ReloadRouteProvider, useReloadRoute] = createContext<() => void>()

export { ReloadRouteProvider, useReloadRoute }
