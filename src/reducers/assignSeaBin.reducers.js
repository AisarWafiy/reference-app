import { assignSeaBinConstants } from 'constants/actions.type.constant/assignSeaBin.constants'

export function assignSeaBin(state = {}, action) {
  switch (action.type) {
    case assignSeaBinConstants.ASSIGN_SEA_BIN_REQUEST:
      return { getData: false }
    case assignSeaBinConstants.ASSIGN_SEA_BIN_SUCCESS:
      return { getData: action.data }
    case assignSeaBinConstants.ASSIGN_SEA_BIN_FAILURE:
      return { getData: action.data }
    default:
      return state
  }
}
