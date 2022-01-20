import { stampDutyConstants } from 'constants/actions.type.constant/stampDuty.constants'

export function getstampDuty(state = {}, action) {
  switch (action.type) {
    case stampDutyConstants.GET_STAMPDUTY_REQUEST:
      return { getData: false }
    case stampDutyConstants.GET_STAMPDUTY_SUCCESS:
      return { getData: action.data }
    case stampDutyConstants.GET_STAMPDUTY_FAILURE:
      return { getData: action.data }
    default:
      return state
  }
}
export function getLocationId(state = {}, action) {
  switch (action.type) {
    case stampDutyConstants.GET_LOCATION_REQUEST:
      return { getData: false }
    case stampDutyConstants.GET_LOCATION_SUCCESS:
      return { getData: action.data }
    case stampDutyConstants.GET_LOCATION_FAILURE:
      return { getData: false }
    default:
      return state
  }
}

export function getMonth(state = {}, action) {
  switch (action.type) {
    case stampDutyConstants.GET_MONTH_REQUEST:
      return { getData: false }
    case stampDutyConstants.GET_MONTH_SUCCESS:
      return { getData: action.data }
    case stampDutyConstants.GET_MONTH_FAILURE:
      return { getData: false }
    default:
      return state
  }
}
