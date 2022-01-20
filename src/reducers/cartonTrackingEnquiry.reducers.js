import { cartonTrackingEnquiryConstants } from 'constants/actions.type.constant/cartonTrackingEnquiry.constants'

export function getCartonTrackingEnquiry(state = {}, action) {
  switch (action.type) {
    case cartonTrackingEnquiryConstants.GET_CARTON_TRACKING_ENQUIRY_REQUEST:
      return { getData: false }
    case cartonTrackingEnquiryConstants.GET_CARTON_TRACKING_ENQUIRY_SUCCESS:
      return { getData: action.data }
    case cartonTrackingEnquiryConstants.GET_CARTON_TRACKING_ENQUIRY_FAILURE:
      return { getData: action.data }
    default:
      return state
  }
}

export function getCartonNumber(state = {}, action) {
  switch (action.type) {
    case cartonTrackingEnquiryConstants.GET_CARTON_NUMBER_REQUEST:
      return { getData: false }
    case cartonTrackingEnquiryConstants.GET_CARTON_NUMBER_SUCCESS:
      return { getData: action.data }
    case cartonTrackingEnquiryConstants.GET_CARTON_NUMBER_FAILURE:
      return { getData: false }
    default:
      return state
  }
}
