import { overrideBagtrackingConstants } from 'constants/actions.type.constant/overrideBagtracking.constants'

export function bagtrackAirport(state = {}, action) {
  switch (action.type) {
    case overrideBagtrackingConstants.BAGTRACK_AIRPORT_REQUEST:
      return { getData: false }
    case overrideBagtrackingConstants.BAGTRACK_AIRPORT_SUCCESS:
      return { getData: action.data }
    case overrideBagtrackingConstants.BAGTRACK_AIRPORT_FAILURE:
      return { getData: action.data }
    default:
      return state
  }
}

export function bagtrackWarehouse(state = {}, action) {
  switch (action.type) {
    case overrideBagtrackingConstants.BAGTRACK_WAREHOUSE_REQUEST:
      return { getData: false }
    case overrideBagtrackingConstants.BAGTRACK_WAREHOUSE_SUCCESS:
      return { getData: action.data }
    case overrideBagtrackingConstants.BAGTRACK_WAREHOUSE_FAILURE:
      return { getData: action.data }
    default:
      return state
  }
}
