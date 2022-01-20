import { truckNumberConstants } from 'constants/actions.type.constant/truckNumber.constants'

export function getTruckNumber(state = {}, action) {
  switch (action.type) {
    case truckNumberConstants.GET_TRUCK_REQUEST:
      return { getData: false }
    case truckNumberConstants.GET_TRUCK_SUCCESS:
      return { getData: action.data }
    case truckNumberConstants.GET_TRUCK_FAILURE:
      return { getData: false }
    default:
      return state
  }
}
export function getSeaBinTruck(state = {}, action) {
  switch (action.type) {
    case truckNumberConstants.GET_SEABIN_TRUCK_REQUEST:
      return { getData: false }
    case truckNumberConstants.GET_SEABIN_TRUCK_SUCCESS:
      return { getData: action.data }
    case truckNumberConstants.GET_SEABIN_TRUCK_FAILURE:
      return { getData: false }
    default:
      return state
  }
}
