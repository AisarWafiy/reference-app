import { cageTrackingEnquiryConstants } from 'constants/actions.type.constant/cageTrackingEnquiry.constants'
import { cageTrackingEnquiryServices } from 'services/cageTrackingEnquiry.service'
import { alertActions } from './alert.actions'
import * as labels from 'constants/labels'
export const cageTrackingEnquiryActions = {
  getCageTrackingEnquiry,
}

function getCageTrackingEnquiry(data) {
  return dispatch => {
    dispatch(request({ data }))
    cageTrackingEnquiryServices.getCageTrackingEnquiry(data).then(
      data => {
        dispatch(success(data))
        dispatch(alertActions.success(data.message, labels.cageTrackingEnquiry))
      },
      error => {
        dispatch(failure(error))
        if (error.error && !error.record)
          dispatch(alertActions.error(error.error, labels.cageTrackingEnquiry))
        else if (error.error && error.record)
          dispatch(alertActions.error(error.record, labels.cageTrackingEnquiry))
        else if (error.warning)
          dispatch(alertActions.warning(error.warning, labels.cageTrackingEnquiry))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return { type: cageTrackingEnquiryConstants.GET_CAGE_TRACKING_ENQUIRY_REQUEST, data }
  }
  function success(data) {
    return { type: cageTrackingEnquiryConstants.GET_CAGE_TRACKING_ENQUIRY_SUCCESS, data }
  }
  function failure(data) {
    return { type: cageTrackingEnquiryConstants.GET_CAGE_TRACKING_ENQUIRY_FAILURE, data }
  }
}
