import { bagsInPickupCounterReportConstants } from 'constants/actions.type.constant/bagsInPickupCounterReport.constants'
import { bagsInPickupCounterReportServices } from 'services/bagsInPickupCounterReport.service'
import { alertActions } from './alert.actions'
import * as labels from 'constants/labels'
export const bagsInPickupCounterReportActions = {
  getBagsInPickupCounterReport,
  getLocation,
}

function getBagsInPickupCounterReport(data) {
  return dispatch => {
    dispatch(request({ data }))
    bagsInPickupCounterReportServices.getBagsInPickupCounterReport(data).then(
      data => {
        dispatch(success(data))
        dispatch(alertActions.success(data.message, labels.bagsInPickupCounterReport))
      },
      error => {
        dispatch(failure(error))
        if (error.error && !error.record)
          dispatch(alertActions.error(error.error, labels.bagsInPickupCounterReport))
        else if (error.error && error.record)
          dispatch(alertActions.error(error.record, labels.bagsInPickupCounterReport))
        else if (error.warning)
          dispatch(alertActions.warning(error.warning, labels.bagsInPickupCounterReport))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return {
      type: bagsInPickupCounterReportConstants.GET_BAGS_IN_PICKUP_COUNTER_REPORT_REQUEST,
      data,
    }
  }
  function success(data) {
    return {
      type: bagsInPickupCounterReportConstants.GET_BAGS_IN_PICKUP_COUNTER_REPORT_SUCCESS,
      data,
    }
  }
  function failure(data) {
    return {
      type: bagsInPickupCounterReportConstants.GET_BAGS_IN_PICKUP_COUNTER_REPORT_FAILURE,
      data,
    }
  }
}

function getLocation(data) {
  return dispatch => {
    dispatch(request({ data }))
    bagsInPickupCounterReportServices.getLocation(data).then(
      data => {
        dispatch(success(data))
        //   dispatch(alertActions.success(data.message, labels.bagsInPickupCounterReport))
      },
      error => {
        dispatch(failure(error.message))
        if (error.error) dispatch(alertActions.error(error.error, labels.bagsInPickupCounterReport))
        else if (error.warning)
          dispatch(alertActions.warning(error.warning, labels.bagsInPickupCounterReport))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return { type: bagsInPickupCounterReportConstants.GET_LOCATION_REQUEST, data }
  }
  function success(data) {
    return { type: bagsInPickupCounterReportConstants.GET_LOCATION_SUCCESS, data }
  }
  function failure(data) {
    return { type: bagsInPickupCounterReportConstants.GET_LOCATION_FAILURE, data }
  }
}
