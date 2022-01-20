import { SET_CARRIER_CODE, SET_DEPARTURE_DATE, SET_ROW_DATA } from 'actions/action-merge-pax'

const initialState = {
  carrierCode: null,
  departureDate: null,
  rowData: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CARRIER_CODE:
      return {
        ...state,
        carrierCode: action.payload,
      }

    case SET_DEPARTURE_DATE:
      return {
        ...state,
        departureDate: action.payload,
      }

    case SET_ROW_DATA:
      return {
        ...state,
        rowData: action.payload,
      }

    default:
      return state
  }
}
