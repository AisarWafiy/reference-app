import { bagStatusFlightConstants } from 'constants/actions.type.constant/bagStatusFlight.constants'

const INIT_STATE = null

export function formValueBagStatusFlight(state = INIT_STATE, action) {
  switch (action.type) {
    case bagStatusFlightConstants.formValueBagStatusFlight:
      return action.payload

    default:
      return state
  }
}

export function getBagStatusFlight(state = {}, action) {
  switch (action.type) {
    case bagStatusFlightConstants.GET_BAG_STATUS_FLIGHT_REQUEST:
      return { getData: false }
    case bagStatusFlightConstants.GET_BAG_STATUS_FLIGHT_SUCCESS:
      return { getData: action.data }
    case bagStatusFlightConstants.GET_BAG_STATUS_FLIGHT_FAILURE:
      return { getData: action.data }
    default:
      return state
  }
}

export function getCarrierCode(state = {}, action) {
  switch (action.type) {
    case bagStatusFlightConstants.GET_CARRIER_CODE_REQUEST:
      return { getData: false }
    case bagStatusFlightConstants.GET_CARRIER_CODE_SUCCESS:
      return { getData: action.data }
    case bagStatusFlightConstants.GET_CARRIER_CODE_FAILURE:
      return { getData: false }
    default:
      return state
  }
}
