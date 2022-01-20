import { binLocTrackingEnqiryConstants } from '../constants/actions.type.constant/binLocationTrackingEnquiry.constants'

export const binLocTrackingEnqiryActions = {
    binLocTrackingEnqirySuccess,
}

function binLocTrackingEnqirySuccess(data) {
    return {
        type: binLocTrackingEnqiryConstants.binLocTrackingEnqirySuccess,
        payload: data,
    }
}