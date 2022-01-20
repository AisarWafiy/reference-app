// action types
export const SET_SAVINGS_ACC = 'SET_SAVINGS_ACC'
export const SET_FLIGHT_ACC = 'SET_FLIGHT_ACC'
export const SET_VESSEL_ACC = 'SET_VESSEL_ACC'
export const SET_BANK_HOLIDAYS = 'SET_BANK_HOLIDAYS'
export const SET_BANK_NON_WORKINGS = 'SET_BANK_NON_WORKINGS'
export const SET_INIT_VAL = 'SET_INIT_VAL'
export const SET_HOLIDAYS_CHANGED = 'SET_HOLIDAYS_CHANGED'

export const setInitVal = values => dispatch => {
  dispatch({
    type: SET_INIT_VAL,
    payload: values,
  })
}

export const setSavingsAcc = values => dispatch => {
  dispatch({
    type: SET_SAVINGS_ACC,
    payload: values,
  })
}

export const setFlightAcc = values => dispatch => {
  dispatch({
    type: SET_FLIGHT_ACC,
    payload: values,
  })
}

export const setVesselAcc = values => dispatch => {
  dispatch({
    type: SET_VESSEL_ACC,
    payload: values,
  })
}

export const setBankHolidays = values => dispatch => {
  dispatch({
    type: SET_BANK_HOLIDAYS,
    payload: values,
  })
}

export const setBankNonWorkings = values => dispatch => {
  dispatch({
    type: SET_BANK_NON_WORKINGS,
    payload: values,
  })
}

export const setHolidaysChanged = values => dispatch => {
  dispatch({
    type: SET_HOLIDAYS_CHANGED,
    payload: values,
  })
}
