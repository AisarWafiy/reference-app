import { bagTraxDeliveryReportByTripConstants } from 'constants/actions.type.constant/bagTraxDeliveryReportByTrip.constants'
import { bagTraxDeliveryReportByTripServices } from 'services/bagTraxDeliveryReportByTrip.service'
import { alertActions } from './alert.actions'
import * as labels from 'constants/labels'
export const bagTraxDeliveryReportByTripActions = {
  getBagTraxDeliveryReportByTrip,
  bagTraxDeliveryReportFormValue,
}
function bagTraxDeliveryReportFormValue(data) {
  return {
    type: bagTraxDeliveryReportByTripConstants.bagTraxDeliveryReportFormValue,
    payload: data,
  }
}

function getBagTraxDeliveryReportByTrip(data) {
  return dispatch => {
    dispatch(request({ data }))
    bagTraxDeliveryReportByTripServices.getBagTraxDeliveryReportByTrip(data).then(
      data => {
        dispatch(success(data))
        dispatch(alertActions.success(data.message, labels.bagTraxDeliveryReportByTrip))
      },
      error => {
        dispatch(failure(error))
        if (error.error && !error.record)
          dispatch(alertActions.error(error.error, labels.bagTraxDeliveryReportByTrip))
        else if (error.error && error.record)
          dispatch(alertActions.error(error.record, labels.bagTraxDeliveryReportByTrip))
        else if (error.warning)
          dispatch(alertActions.warning(error.warning, labels.bagTraxDeliveryReportByTrip))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return {
      type: bagTraxDeliveryReportByTripConstants.GET_BAGTRAX_DELIVERY_REPORT_BY_TRIP_REQUEST,
      data,
    }
  }
  function success(data) {
    return {
      type: bagTraxDeliveryReportByTripConstants.GET_BAGTRAX_DELIVERY_REPORT_BY_TRIP_SUCCESS,
      data,
    }
  }
  function failure(data) {
    return {
      type: bagTraxDeliveryReportByTripConstants.GET_BAGTRAX_DELIVERY_REPORT_BY_TRIP_FAILURE,
      data,
    }
  }
}
