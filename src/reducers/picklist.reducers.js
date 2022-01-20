import { picklistConstants } from 'constants/actions.type.constant/picklist.constants'

export function getPicklist(state = {}, action) {
  switch (action.type) {
    case picklistConstants.GET_PICKLIST_REQUEST:
      return { getData: false }
    case picklistConstants.GET_PICKLIST_SUCCESS:
      return { getData: action.data }
    case picklistConstants.GET_PICKLIST_FAILURE:
      return { getData: action.data }
    default:
      return state
  }
}

export function printPicklist(state = {}, action) {
  switch (action.type) {
    case picklistConstants.PRINT_PICKLIST_REQUEST:
      return { getData: false }
    case picklistConstants.PRINT_PICKLIST_SUCCESS:
      return { getData: action.data }
    case picklistConstants.PRINT_PICKLIST_FAILURE:
      return { getData: action.data }
    default:
      return state
  }
}

export function getDrop(state = {}, action) {
  switch (action.type) {
    case picklistConstants.GET_DROP_REQUEST:
      return { getData: false }
    case picklistConstants.GET_DROP_SUCCESS:
      return { getData: action.data }
    case picklistConstants.GET_DROP_FAILURE:
      return { getData: false }
    default:
      return state
  }
}
