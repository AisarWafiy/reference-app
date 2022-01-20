import { SET_PREVIEW_FLIGHT_NO, SET_PREVIEW_DEPARTURE_DATE } from 'actions/action-naccs'

const initialState = {
  previewFlightNo: null,
  previewDepartureDate: null,
}

export default (state = initialState, action) => {

  switch (action.type) {
    case SET_PREVIEW_FLIGHT_NO:
      return {
        ...state,
        previewFlightNo: action.payload,
      }
    case SET_PREVIEW_DEPARTURE_DATE:
      return {
        ...state,
        previewDepartureDate: action.payload,
      }
    default:
      return state
  }
}
