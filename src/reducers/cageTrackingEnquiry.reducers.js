import { cageTrackingEnquiryConstants } from 'constants/actions.type.constant/cageTrackingEnquiry.constants'

export function getCageTrackingEnquiry(state = {}, action) {
  switch (action.type) {
    case cageTrackingEnquiryConstants.GET_CAGE_TRACKING_ENQUIRY_REQUEST:
      return { getData: false }
    case cageTrackingEnquiryConstants.GET_CAGE_TRACKING_ENQUIRY_SUCCESS:
      return { getData: action.data }
    case cageTrackingEnquiryConstants.GET_CAGE_TRACKING_ENQUIRY_FAILURE:
      return { getData: action.data }
    default:
      return state
  }
}
