import { bagTrackingEnquiryConstants } from 'constants/actions.type.constant/bagTrackingEnquiry.constants'
import { bagTrackingEnquiryServices } from 'services/bagTrackingEnquiry.service'
import { alertActions } from './alert.actions'
import * as labels from 'constants/labels'
export const bagTrackingEnquiryActions = {
  getBagTrackingEnquiry,
}

function getBagTrackingEnquiry(data) {
  return dispatch => {
    dispatch(request({ data }))
    bagTrackingEnquiryServices.getBagTrackingEnquiry(data).then(
      data => {
        dispatch(success(data))
        dispatch(alertActions.success(data.message, labels.bagTrackingEnquiry))
      },
      error => {
        dispatch(failure(error))
        if (error.error && !error.record)
          dispatch(alertActions.error(error.error, labels.bagTrackingEnquiry))
        else if (error.error && error.record)
          dispatch(alertActions.error(error.record, labels.bagTrackingEnquiry))
        else if (error.warning)
          dispatch(alertActions.warning(error.warning, labels.bagTrackingEnquiry))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return { type: bagTrackingEnquiryConstants.GET_BAG_TRACKING_ENQUIRY_REQUEST, data }
  }
  function success(data) {
    return { type: bagTrackingEnquiryConstants.GET_BAG_TRACKING_ENQUIRY_SUCCESS, data }
  }
  function failure(data) {
    return { type: bagTrackingEnquiryConstants.GET_BAG_TRACKING_ENQUIRY_FAILURE, data }
  }
}
