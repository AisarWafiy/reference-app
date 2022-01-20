import { mergePaxConstants } from 'constants/actions.type.constant/mergePax.constants'

export function getPax(state = {}, action) {
  switch (action.type) {
    case mergePaxConstants.GET_PAX_REQUEST:
      return { getData: false }
    case mergePaxConstants.GET_PAX_SUCCESS:
      return { getData: action.data }
    case mergePaxConstants.GET_PAX_FAILURE:
      return { getData: false }
    default:
      return state
  }
}

export function mergePax(state = {}, action) {
  switch (action.type) {
    case mergePaxConstants.POST_PAX_REQUEST:
      return { getData: false }
    case mergePaxConstants.POST_PAX_SUCCESS:
      return { getData: action.data }
    case mergePaxConstants.POST_PAX_FAILURE:
      return { getData: false }
    default:
      return state
  }
}
export function getCarr(state = {}, action) {
  switch (action.type) {
    case mergePaxConstants.GET_CARR_REQUEST:
      return { getData: false }
    case mergePaxConstants.GET_CARR_SUCCESS:
      return { getData: action.data }
    case mergePaxConstants.GET_CARR_FAILURE:
      return { getData: false }
    default:
      return state
  }
}
