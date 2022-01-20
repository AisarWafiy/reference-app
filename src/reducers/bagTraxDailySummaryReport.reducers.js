import { bagTraxDailySummaryReportConstants } from 'constants/actions.type.constant/bagTraxDailySummaryReport.constants'

const INIT_STATE = null

export function bagTraxDailyFormValue(state = INIT_STATE, action) {
  switch (action.type) {
    case bagTraxDailySummaryReportConstants.bagTraxDailyFormValue:
      return action.payload

    default:
      return state
  }
}

export function getBagTraxDailySummaryReport(state = {}, action) {
  switch (action.type) {
    case bagTraxDailySummaryReportConstants.GET_BAGTRAX_DAILY_SUMMARY_REPORT_REQUEST:
      return { getData: false }
    case bagTraxDailySummaryReportConstants.GET_BAGTRAX_DAILY_SUMMARY_REPORT_SUCCESS:
      return { getData: action.data }
    case bagTraxDailySummaryReportConstants.GET_BAGTRAX_DAILY_SUMMARY_REPORT_FAILURE:
      return { getData: action.data }
    default:
      return state
  }
}
