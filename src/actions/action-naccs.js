// action types
export const SET_PREVIEW_FLIGHT_NO = 'SET_PREVIEW_FLIGHT_NO'
export const SET_PREVIEW_DEPARTURE_DATE = 'SET_PREVIEW_DEPARTURE_DATE'

export const setPreviewFlightNo = data => dispatch => {
  dispatch({
    type: SET_PREVIEW_FLIGHT_NO,
    payload: data,
  })
}

export const setPreviewDepartureDate = data => dispatch => {
  dispatch({
    type: SET_PREVIEW_DEPARTURE_DATE,
    payload: data,
  })
}
