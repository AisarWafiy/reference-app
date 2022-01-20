import { paxDFPurchaseEnqiryConstants } from '../constants/actions.type.constant/paxDFPurchaseEnquiry.constants'

export const paxDFPurchaseEnqiryActions = {
    paxDFPurchaseEnqirySuccess,
}

function paxDFPurchaseEnqirySuccess(data) {
    return {
        type: paxDFPurchaseEnqiryConstants.paxDFPurchaseEnqirySuccess,
        payload: data,
    }
}