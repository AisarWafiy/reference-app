import { bagTraxDeliveryReportByTripConstants } from 'constants/actions.type.constant/bagTraxDeliveryReportByTrip.constants'

const INIT_STATE = null

export function bagTraxDeliveryReportFormValue(state = INIT_STATE, action) {
  switch (action.type) {
    case bagTraxDeliveryReportByTripConstants.bagTraxDeliveryReportFormValue:
      return action.payload

    default:
      return state
  }
}

export function getBagTraxDeliveryReportByTrip(state = {}, action) {
  switch (action.type) {
    case bagTraxDeliveryReportByTripConstants.GET_BAGTRAX_DELIVERY_REPORT_BY_TRIP_REQUEST:
      return { getData: false }
    case bagTraxDeliveryReportByTripConstants.GET_BAGTRAX_DELIVERY_REPORT_BY_TRIP_SUCCESS:
      return { getData: action.data }
    case bagTraxDeliveryReportByTripConstants.GET_BAGTRAX_DELIVERY_REPORT_BY_TRIP_FAILURE:
      return { getData: action.data }
    default:
      return state
  }
}
