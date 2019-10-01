import { Location } from 'history'

export function locationsAreEqual(
  firstLocation: Location,
  secondLocation: Location
) {
  return (
    firstLocation.pathname === secondLocation.pathname &&
    firstLocation.search === secondLocation.search &&
    firstLocation.hash === secondLocation.hash
  )
}
