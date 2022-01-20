import {
  SET_DATA_FROM,
  SET_NOTIFICATION_TYPE,
  SET_ACTION_TYPE,
  SET_FLIGHT_ALERTS,
  SET_REFUND_ALERTS,
  SET_BELL_COUNT,
  NACCS_AUTO_GEN_STATUS_REQUEST,
  SET_DASHBOARD_DATA
} from 'actions/action-dashboard'
import { dataFromTypes } from 'constants/types'

const initialState = {
  dataFrom: dataFromTypes[1],
  notificationType: {},
  actionType: {},
  flightChangeAlertCount: 0,
  refundChangeAlertCount: 0,
  bellCount: 0,
  naccsAutoGenStatus: false,
  dashboardData: {}
}

export default (state = initialState, action) => {

  switch (action.type) {
    case SET_DATA_FROM:
      return {
        ...state,
        dataFrom: action.payload,
      }
    case SET_NOTIFICATION_TYPE:
      return {
        ...state,
        notificationType: action.payload,
      }
    case SET_ACTION_TYPE:
      return {
        ...state,
        actionType: action.payload,
      }
    case SET_FLIGHT_ALERTS:
      return {
        ...state,
        flightChangeAlertCount: action.payload,
      }
    case SET_REFUND_ALERTS:
      return {
        ...state,
        refundChangeAlertCount: action.payload,
      }
    case SET_BELL_COUNT:
      return {
        ...state,
        bellCount: state.refundChangeAlertCount + state.flightChangeAlertCount,
      }
    case NACCS_AUTO_GEN_STATUS_REQUEST:
      return {
        ...state,
        naccsAutoGenStatus: action.payload

      }
    case SET_DASHBOARD_DATA:

      return {
        ...state,
        dashboardData: action.payload

      }

    default:
      return state
  }
}
