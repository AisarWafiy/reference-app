import { bagByBagStatusReportConstants } from 'constants/actions.type.constant/bagByBagStatusReport.constants'
import { bagByBagStatusReportServices } from 'services/bagByBagStatusReport.service'
import { alertActions } from './alert.actions'
import * as labels from 'constants/labels'
export const bagByBagStatusReportActions = {
  getBagByBagStatusReport,
  getBagStatus,
  bagByBagStatusReportFormValue,
}

function bagByBagStatusReportFormValue(data) {
  return {
    type: bagByBagStatusReportConstants.bagByBagStatusReportFormValue,
    payload: data,
  }
}

function getBagByBagStatusReport(data) {
  return dispatch => {
    dispatch(request({ data }))
    bagByBagStatusReportServices.getBagByBagStatusReport(data).then(
      data => {
        dispatch(success(data))
        dispatch(alertActions.success(data.message, labels.bagByBagStatusReport))
      },
      error => {
        dispatch(failure(error))
        if (error.error && !error.record)
          dispatch(alertActions.error(error.error, labels.bagByBagStatusReport))
        else if (error.error && error.record)
          dispatch(alertActions.error(error.record, labels.bagByBagStatusReport))
        else if (error.warning)
          dispatch(alertActions.warning(error.warning, labels.bagByBagStatusReport))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return { type: bagByBagStatusReportConstants.GET_BAG_BY_BAG_STATUS_REPORT_REQUEST, data }
  }
  function success(data) {
    return { type: bagByBagStatusReportConstants.GET_BAG_BY_BAG_STATUS_REPORT_SUCCESS, data }
  }
  function failure(data) {
    return { type: bagByBagStatusReportConstants.GET_BAG_BY_BAG_STATUS_REPORT_FAILURE, data }
  }
}

function getBagStatus(data) {
  return dispatch => {
    dispatch(request({ data }))
    bagByBagStatusReportServices.getBagStatus(data).then(
      data => {
        dispatch(success(data))
        //   dispatch(alertActions.success(data.message, labels.bagByBagStatusReport))
      },
      error => {
        dispatch(failure(error.message))
        if (error.error && !error.record)
          dispatch(alertActions.error(error.error, labels.bagByBagStatusReport))
        else if (error.error && error.record)
          dispatch(alertActions.error(error.record, labels.bagByBagStatusReport))
        else if (error.warning)
          dispatch(alertActions.warning(error.warning, labels.bagByBagStatusReport))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return { type: bagByBagStatusReportConstants.GET_BAG_STATUS_REQUEST, data }
  }
  function success(data) {
    return { type: bagByBagStatusReportConstants.GET_BAG_STATUS_SUCCESS, data }
  }
  function failure(data) {
    return { type: bagByBagStatusReportConstants.GET_BAG_STATUS_FAILURE, data }
  }
}
