import { cageConstants } from 'constants/actions.type.constant/cage.constants'

export function postCage(state = {}, action) {
  switch (action.type) {
    case cageConstants.POST_CAGE_REQUEST:
      return { getData: false }
    case cageConstants.POST_CAGE_SUCCESS:
      return { getData: action.data }
    case cageConstants.POST_CAGE_FAILURE:
      return { getData: action.data }
    default:
      return state
  }
}

export function updateCage(state = {}, action) {
  switch (action.type) {
    case cageConstants.POST_CAGE_REQUEST:
      return { getData: false }
    case cageConstants.POST_CAGE_SUCCESS:
      return { getData: action.data }
    case cageConstants.POST_CAGE_FAILURE:
      return { getData: action.data }
    default:
      return state
  }
}

export function deleteCage(state = {}, action) {
  switch (action.type) {
    case cageConstants.DELETE_CAGE_REQUEST:
      return { getData: false }
    case cageConstants.DELETE_CAGE_SUCCESS:
      return { getData: action.data }
    case cageConstants.DELETE_CAGE_FAILURE:
      return { getData: action.data }
    default:
      return state
  }
}

export function getCage(state = {}, action) {
  switch (action.type) {
    case cageConstants.GET_CAGE_REQUEST:
      return { getData: false }
    case cageConstants.GET_CAGE_SUCCESS:
      return { getData: action.data }
    case cageConstants.GET_CAGE_FAILURE:
      return { getData: action.data }
    default:
      return state
  }
}

export function getAllCage(state = {}, action) {
  switch (action.type) {
    case cageConstants.GET_ALL_CAGE_REQUEST:
      return { getData: false }
    case cageConstants.GET_ALL_CAGE_SUCCESS:
      return { getData: action.data }
    case cageConstants.GET_ALL_CAGE_FAILURE:
      return { getData: action.data }
    default:
      return state
  }
}
