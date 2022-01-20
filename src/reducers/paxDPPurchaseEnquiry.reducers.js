import { paxDPPurchaseEnqiryConstants } from 'constants/actions.type.constant/paxDPPurchaseEnquiry.constants'

const INIT_STATE = null

export function paxDPPurchaseEnqirySuccess(state = INIT_STATE, action) {
    switch (action.type) {
        case paxDPPurchaseEnqiryConstants.paxDPPurchaseEnqirySuccess:
            return action.payload

        default:
            return state
    }
}