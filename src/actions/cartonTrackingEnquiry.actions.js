import { cartonTrackingEnquiryConstants } from 'constants/actions.type.constant/cartonTrackingEnquiry.constants'
import { cartonTrackingEnquiryServices } from 'services/cartonTrackingEnquiry.service'
import { alertActions } from './alert.actions'
import * as labels from 'constants/labels'
export const cartonTrackingEnquiryActions = {
  getCartonTrackingEnquiry,
  getCartonNumber,
}

function getCartonTrackingEnquiry(data) {
  return dispatch => {
    dispatch(request({ data }))
    cartonTrackingEnquiryServices.getCartonTrackingEnquiry(data).then(
      data => {
        dispatch(success(data))
        dispatch(alertActions.success(data.message, labels.cartonTrackingEnquiry))
      },
      error => {
        dispatch(failure(error))
        if (error.error && !error.record)
          dispatch(alertActions.error(error.error, labels.cartonTrackingEnquiry))
        else if (error.error && error.record)
          dispatch(alertActions.error(error.record, labels.cartonTrackingEnquiry))
        else if (error.warning)
          dispatch(alertActions.warning(error.warning, labels.cartonTrackingEnquiry))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return { type: cartonTrackingEnquiryConstants.GET_CARTON_TRACKING_ENQUIRY_REQUEST, data }
  }
  function success(data) {
    return { type: cartonTrackingEnquiryConstants.GET_CARTON_TRACKING_ENQUIRY_SUCCESS, data }
  }
  function failure(data) {
    return { type: cartonTrackingEnquiryConstants.GET_CARTON_TRACKING_ENQUIRY_FAILURE, data }
  }
}

function getCartonNumber(data) {
  return dispatch => {
    dispatch(request({ data }))
    cartonTrackingEnquiryServices.getCartonNumber(data).then(
      data => {
        dispatch(success(data))
      },
      error => {
        dispatch(failure(error.message))
      },
    )
  }
  function request(data) {
    return { type: cartonTrackingEnquiryConstants.GET_CARTON_NUMBER_REQUEST, data }
  }
  function success(data) {
    return { type: cartonTrackingEnquiryConstants.GET_CARTON_NUMBER_SUCCESS, data }
  }
  function failure(data) {
    return { type: cartonTrackingEnquiryConstants.GET_CARTON_NUMBER_FAILURE, data }
  }
}
