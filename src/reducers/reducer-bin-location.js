import { SET_INPUT_OPTIONS, SET_ROW_DATA, SET_LOCATION_TYPE } from 'actions/action-bin-location'
import { locTypeOptions } from 'constants/types'

const initialState = {
  rowData: [],
  pickupLocations: [],
  locationType: locTypeOptions[0],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_INPUT_OPTIONS:
      return {
        ...state,
        pickupLocations: action.payload.pickupLocations,
      }

    case SET_ROW_DATA:
      return {
        ...state,
        rowData: action.payload,
      }

    case SET_LOCATION_TYPE:
      return {
        ...state,
        locationType: action.payload,
      }

    // case CLEAR_ROW_DATA:
    //   return {
    //     ...state,
    //     rowData: [],
    //   }

    default:
      return state
  }
}
