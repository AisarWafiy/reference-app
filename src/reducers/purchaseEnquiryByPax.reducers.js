import { purchaseEnquiryByPaxConstants } from 'constants/actions.type.constant/purchaseEnquiryByPax.constants'

export function getPurchaseEnquiryByPax(state = {}, action) {
  switch (action.type) {
    case purchaseEnquiryByPaxConstants.GET_PURCHASE_ENQUIRY_BY_PAX_REQUEST:
      return { getData: false }
    case purchaseEnquiryByPaxConstants.GET_PURCHASE_ENQUIRY_BY_PAX_SUCCESS:
      return { getData: action.data }
    case purchaseEnquiryByPaxConstants.GET_PURCHASE_ENQUIRY_BY_PAX_FAILURE:
      return { getData: action.data }
    default:
      return state
  }
}
