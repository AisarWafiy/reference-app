import { itemEnquiryConstants } from '../constants/actions.type.constant/itemEnquiry.constants'

export const itemEnquiryActions = {
  itemEnquirySuccess,
}

function itemEnquirySuccess(data) {
  return {
    type: itemEnquiryConstants.itemEnquirySuccess,
    payload: data,
  }
}
