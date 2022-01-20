import { binLocTrackingEnqiryConstants } from 'constants/actions.type.constant/binLocationTrackingEnquiry.constants'

const INIT_STATE = null

export function binLocTrackingEnqirySuccess(state = INIT_STATE, action) {
    switch (action.type) {
        case binLocTrackingEnqiryConstants.binLocTrackingEnqirySuccess:
            return action.payload

        default:
            return state
    }
}