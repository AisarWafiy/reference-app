import { bagsInPickupCounterReportConstants } from 'constants/actions.type.constant/bagsInPickupCounterReport.constants'

export function getBagsInPickupCounterReport(state = {}, action) {
  switch (action.type) {
    case bagsInPickupCounterReportConstants.GET_BAGS_IN_PICKUP_COUNTER_REPORT_REQUEST:
      return { getData: false }
    case bagsInPickupCounterReportConstants.GET_BAGS_IN_PICKUP_COUNTER_REPORT_SUCCESS:
      return { getData: action.data }
    case bagsInPickupCounterReportConstants.GET_BAGS_IN_PICKUP_COUNTER_REPORT_FAILURE:
      return { getData: action.data }
    default:
      return state
  }
}

export function getLocation(state = {}, action) {
  switch (action.type) {
    case bagsInPickupCounterReportConstants.GET_LOCATION_REQUEST:
      return { getData: false }
    case bagsInPickupCounterReportConstants.GET_LOCATION_SUCCESS:
      return { getData: action.data }
    case bagsInPickupCounterReportConstants.GET_LOCATION_FAILURE:
      return { getData: false }
    default:
      return state
  }
}
