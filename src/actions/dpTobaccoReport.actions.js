import { dpTobaccoReportConstants } from 'constants/actions.type.constant/dpTobaccoReport.constants'
import { dpTobaccoReportServices } from 'services/dpTobaccoReport.service'
import { alertActions } from './alert.actions'
import * as labels from 'constants/labels'
export const dpTobaccoReportActions = {
  getDPTobaccoDeliveryReport,
  getDPTobaccoExportReport,
}

function getDPTobaccoDeliveryReport(data) {
  return dispatch => {
    dispatch(request({ data }))
    dpTobaccoReportServices.getDPTobaccoDeliveryReport(data).then(
      data => {
        dispatch(success(data))
        dispatch(alertActions.success(data.message, labels.dpTobaccoReport))
      },
      error => {
        dispatch(failure(error))
        if (error.error && !error.record)
          dispatch(alertActions.error(error.error, labels.dpTobaccoReport))
        else if (error.error && error.record)
          dispatch(alertActions.error(error.record, labels.dpTobaccoReport))
        else if (error.warning)
          dispatch(alertActions.warning(error.warning, labels.dpTobaccoReport))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return { type: dpTobaccoReportConstants.GET_DP_TOBACCO_DELIVERY_REPORT_REQUEST, data }
  }
  function success(data) {
    return { type: dpTobaccoReportConstants.GET_DP_TOBACCO_DELIVERY_REPORT_SUCCESS, data }
  }
  function failure(data) {
    return { type: dpTobaccoReportConstants.GET_DP_TOBACCO_DELIVERY_REPORT_FAILURE, data }
  }
}

function getDPTobaccoExportReport(data) {
  return dispatch => {
    dispatch(request({ data }))
    dpTobaccoReportServices.getDPTobaccoExportReport(data).then(
      data => {
        dispatch(success(data))
        dispatch(alertActions.success(data.message, labels.dpTobaccoReport))
      },
      error => {
        dispatch(failure(error))
        if (error.error && !error.record)
          dispatch(alertActions.error(error.error, labels.dpTobaccoReport))
        else if (error.error && error.record)
          dispatch(alertActions.error(error.record, labels.dpTobaccoReport))
        else if (error.warning)
          dispatch(alertActions.warning(error.warning, labels.dpTobaccoReport))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return { type: dpTobaccoReportConstants.GET_DP_TOBACCO_EXPORT_REPORT_REQUEST, data }
  }
  function success(data) {
    return { type: dpTobaccoReportConstants.GET_DP_TOBACCO_EXPORT_REPORT_SUCCESS, data }
  }
  function failure(data) {
    return { type: dpTobaccoReportConstants.GET_DP_TOBACCO_EXPORT_REPORT_FAILURE, data }
  }
}
