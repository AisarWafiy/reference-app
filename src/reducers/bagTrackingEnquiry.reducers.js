import { bagTrackingEnquiryConstants } from 'constants/actions.type.constant/bagTrackingEnquiry.constants'

export function getBagTrackingEnquiry(state = {}, action) {
  switch (action.type) {
    case bagTrackingEnquiryConstants.GET_BAG_TRACKING_ENQUIRY_REQUEST:
      return { getData: false }
    case bagTrackingEnquiryConstants.GET_BAG_TRACKING_ENQUIRY_SUCCESS:
      return { getData: action.data }
    case bagTrackingEnquiryConstants.GET_BAG_TRACKING_ENQUIRY_FAILURE:
      return { getData: action.data }
    default:
      return state
  }
}
