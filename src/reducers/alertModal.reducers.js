import { ALERT_MODAL_STATUS_MSG_REQUEST } from 'actions/alertModal.actions'

const initialState = {
    alertModalStatus: false,
    alertModalMsg: ''
}

export default (state = initialState, action) => {
    switch (action.type) {
        case ALERT_MODAL_STATUS_MSG_REQUEST:
            return {
                ...state,
                alertModalStatus: action.payload.status,
                alertModalMsg: action.payload.message
            }

        default:
            return state
    }
}