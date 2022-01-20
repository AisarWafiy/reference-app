import { dpTobaccoReportConstants } from '../constants/actions.type.constant/dpTobaccoReport.constants'

export function getDPTobaccoDeliveryReport(state = {}, action) {
  switch (action.type) {
    case dpTobaccoReportConstants.GET_DP_TOBACCO_DELIVERY_REPORT_REQUEST:
      return { getData: false }
    case dpTobaccoReportConstants.GET_DP_TOBACCO_DELIVERY_REPORT_SUCCESS:
      return { getData: action.data }
    case dpTobaccoReportConstants.GET_DP_TOBACCO_DELIVERY_REPORT_FAILURE:
      return { getData: action.data }
    default:
      return state
  }
}

export function getDPTobaccoExportReport(state = {}, action) {
  switch (action.type) {
    case dpTobaccoReportConstants.GET_DP_TOBACCO_EXPORT_REPORT_REQUEST:
      return { getData: false }
    case dpTobaccoReportConstants.GET_DP_TOBACCO_EXPORT_REPORT_SUCCESS:
      return { getData: action.data }
    case dpTobaccoReportConstants.GET_DP_TOBACCO_EXPORT_REPORT_FAILURE:
      return { getData: action.data }
    default:
      return state
  }
}
