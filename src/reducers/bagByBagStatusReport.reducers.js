import { bagByBagStatusReportConstants } from 'constants/actions.type.constant/bagByBagStatusReport.constants'

const INIT_STATE = null

export function bagByBagStatusReportFormValue(state = INIT_STATE, action) {
  switch (action.type) {
    case bagByBagStatusReportConstants.bagByBagStatusReportFormValue:
      return action.payload

    default:
      return state
  }
}

export function getBagByBagStatusReport(state = {}, action) {
  switch (action.type) {
    case bagByBagStatusReportConstants.GET_BAG_BY_BAG_STATUS_REPORT_REQUEST:
      return { getData: false }
    case bagByBagStatusReportConstants.GET_BAG_BY_BAG_STATUS_REPORT_SUCCESS:
      return { getData: action.data }
    case bagByBagStatusReportConstants.GET_BAG_BY_BAG_STATUS_REPORT_FAILURE:
      return { getData: action.data }
    default:
      return state
  }
}

export function getBagStatus(state = {}, action) {
  switch (action.type) {
    case bagByBagStatusReportConstants.GET_BAG_STATUS_REQUEST:
      return { getData: false }
    case bagByBagStatusReportConstants.GET_BAG_STATUS_SUCCESS:
      return { getData: action.data }
    case bagByBagStatusReportConstants.GET_BAG_STATUS_FAILURE:
      return { getData: false }
    default:
      return state
  }
}
