// action types
export const SET_CARRIER_CODE = 'SET_CARRIER_CODE'
export const SET_DEPARTURE_DATE = 'SET_DEPARTURE_DATE'
export const SET_ROW_DATA = 'SET_ROW_DATA'

export const setCarrierCode = values => dispatch => {
  dispatch({
    type: SET_CARRIER_CODE,
    payload: values,
  })
}

export const setDepartureDate = values => dispatch => {
  dispatch({
    type: SET_DEPARTURE_DATE,
    payload: values,
  })
}

export const setRowData = values => dispatch => {
  dispatch({
    type: SET_ROW_DATA,
    payload: values,
  })
}
