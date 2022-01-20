
export const ALERT_MODAL_STATUS_MSG_REQUEST = 'ALERT_MODAL_STATUS_MSG_REQUEST'

export const alertModelStatusMsgRequest = (status, message) => {
    return {
        type: ALERT_MODAL_STATUS_MSG_REQUEST,
        payload: { status, message }
    }
}