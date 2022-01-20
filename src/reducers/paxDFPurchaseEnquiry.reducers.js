import { paxDFPurchaseEnqiryConstants } from 'constants/actions.type.constant/paxDFPurchaseEnquiry.constants'

const INIT_STATE = null

export function paxDFPurchaseEnqirySuccess(state = INIT_STATE, action) {
    switch (action.type) {
        case paxDFPurchaseEnqiryConstants.paxDFPurchaseEnqirySuccess:
            return action.payload

        default:
            return state
    }
}