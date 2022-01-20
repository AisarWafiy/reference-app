import { bagTraxDailySummaryReportConstants } from 'constants/actions.type.constant/bagTraxDailySummaryReport.constants'
import { bagTraxDailySummaryReportServices } from 'services/bagTraxDailySummaryReport.service'
import { alertActions } from './alert.actions'
import * as labels from 'constants/labels'
export const bagTraxDailySummaryReportActions = {
  getBagTraxDailySummaryReport,
  bagTraxDailyFormValue,
}
function bagTraxDailyFormValue(data) {
  return {
    type: bagTraxDailySummaryReportConstants.bagTraxDailyFormValue,
    payload: data,
  }
}
function getBagTraxDailySummaryReport(data) {
  return dispatch => {
    dispatch(request({ data }))
    bagTraxDailySummaryReportServices.getBagTraxDailySummaryReport(data).then(
      data => {
        dispatch(success(data))
        dispatch(alertActions.success(data.message, labels.bagTraxDailySummaryReport))
      },
      error => {
        dispatch(failure(error))
        if (error.error && !error.record)
          dispatch(alertActions.error(error.error, labels.bagTraxDailySummaryReport))
        else if (error.error && error.record)
          dispatch(alertActions.error(error.record, labels.bagTraxDailySummaryReport))
        else if (error.warning)
          dispatch(alertActions.warning(error.warning, labels.bagTraxDailySummaryReport))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return {
      type: bagTraxDailySummaryReportConstants.GET_BAGTRAX_DAILY_SUMMARY_REPORT_REQUEST,
      data,
    }
  }
  function success(data) {
    return {
      type: bagTraxDailySummaryReportConstants.GET_BAGTRAX_DAILY_SUMMARY_REPORT_SUCCESS,
      data,
    }
  }
  function failure(data) {
    return {
      type: bagTraxDailySummaryReportConstants.GET_BAGTRAX_DAILY_SUMMARY_REPORT_FAILURE,
      data,
    }
  }
}
