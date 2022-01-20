import { itemEnquiryConstants } from 'constants/actions.type.constant/itemEnquiry.constants'

const INIT_STATE = null

export function itemEnquirySuccess(state = INIT_STATE, action) {
  switch (action.type) {
    case itemEnquiryConstants.itemEnquirySuccess:
      return action.payload

    default:
      return state
  }
}
