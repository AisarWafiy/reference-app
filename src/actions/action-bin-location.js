// action types
export const SET_INPUT_OPTIONS = 'SET_INPUT_OPTIONS'
export const SET_ROW_DATA = 'SET_ROW_DATA'
export const SET_LOCATION_TYPE = 'SET_LOCATION_TYPE'

export const setInputOptions = values => dispatch => {
  dispatch({
    type: SET_INPUT_OPTIONS,
    payload: values,
  })
}

export const setRowData = values => dispatch => {
  dispatch({
    type: SET_ROW_DATA,
    payload: values,
  })
}

export const setLocationType = values => dispatch => {
  dispatch({
    type: SET_LOCATION_TYPE,
    payload: values,
  })
}
