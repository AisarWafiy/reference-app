import { maintainUserDataConstants } from 'constants/actions.type.constant/maintainUserData.constants'

export function postUser(state = {}, action) {
  switch (action.type) {
    case maintainUserDataConstants.POST_MAINTAIN_USER_DATA_REQUEST:
      return { getData: false }
    case maintainUserDataConstants.POST_MAINTAIN_USER_DATA_SUCCESS:
      return { getData: action.data }
    case maintainUserDataConstants.POST_MAINTAIN_USER_DATA_FAILURE:
      return { getData: false }
    default:
      return state
  }
}

export function getUser(state = {}, action) {
  switch (action.type) {
    case maintainUserDataConstants.GET_MAINTAIN_USER_DATA_REQUEST:
      return { getData: false }
    case maintainUserDataConstants.GET_MAINTAIN_USER_DATA_SUCCESS:
      return { getData: action.data }
    case maintainUserDataConstants.GET_MAINTAIN_USER_DATA_FAILURE:
      return { getData: false }
    default:
      return state
  }
}

export function getRole(state = {}, action) {
  switch (action.type) {
    case maintainUserDataConstants.GET_MAINTAIN_USER_ROLES_DATA_REQUEST:
      return { getData: false }
    case maintainUserDataConstants.GET_MAINTAIN_USER_ROLES_DATA_SUCCESS:
      return { getData: action.data }
    case maintainUserDataConstants.GET_MAINTAIN_USER_ROLES_DATA_FAILURE:
      return { getData: false }
    default:
      return state
  }
}
