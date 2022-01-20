// action types
export const SET_DATA_FROM = 'SET_DATA_FROM'
export const SET_NOTIFICATION_TYPE = 'SET_NOTIFICATION_TYPE'
export const SET_ACTION_TYPE = 'SET_ACTION_TYPE'
export const SET_FLIGHT_ALERTS = 'SET_FLIGHT_ALERTS'
export const SET_REFUND_ALERTS = 'SET_REFUND_ALERTS'
export const SET_BELL_COUNT = 'SET_BELL_COUNT'
export const NACCS_AUTO_GEN_STATUS_REQUEST = 'NACCS_AUTO_GEN_STATUS_REQUEST'
export const SET_DASHBOARD_DATA = 'SET_DASHBOARD_DATA'

export const setDataFrom = values => dispatch => {
  dispatch({
    type: SET_DATA_FROM,
    payload: values,
  })
}

export const setNotificationType = values => dispatch => {
  dispatch({
    type: SET_NOTIFICATION_TYPE,
    payload: values,
  })
}

export const setActionType = values => dispatch => {
  dispatch({
    type: SET_ACTION_TYPE,
    payload: values,
  })
}

export const setFlightAlerts = value => dispatch => {
  dispatch({
    type: SET_FLIGHT_ALERTS,
    payload: value,
  })
}

export const setRefundAlerts = value => dispatch => {
  dispatch({
    type: SET_REFUND_ALERTS,
    payload: value,
  })
}

export const setBellCount = () => dispatch => {
  dispatch({
    type: SET_BELL_COUNT,
    payload: null,
  })
}


export const naccsAutoGenStatusRequest = (status) => {
  return {
    type: NACCS_AUTO_GEN_STATUS_REQUEST,
    payload: status
  }
}


export const setDashBoardData = (data) => {
  return {
    type: SET_DASHBOARD_DATA,
    payload: data
  }
}
