import { paxDPPurchaseEnqiryConstants } from '../constants/actions.type.constant/paxDPPurchaseEnquiry.constants'

export const paxDPPurchaseEnqiryActions = {
    paxDPPurchaseEnqirySuccess,
}

function paxDPPurchaseEnqirySuccess(data) {
    return {
        type: paxDPPurchaseEnqiryConstants.paxDPPurchaseEnqirySuccess,
        payload: data,
    }
}