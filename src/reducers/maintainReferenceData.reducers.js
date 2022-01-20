import { maintainReferenceDataConstants } from '../constants/actions.type.constant/maintainReferenceData.constants'

export function postRef(state = {}, action) {
  switch (action.type) {
    case maintainReferenceDataConstants.POST_MAINTAIN_REFERENCE_DATA_REQUEST:
      return { getData: false }
    case maintainReferenceDataConstants.POST_MAINTAIN_REFERENCE_DATA_SUCCESS:
      return { getData: action.data }
    case maintainReferenceDataConstants.POST_MAINTAIN_REFERENCE_DATA_FAILURE:
      return { getData: false }
    default:
      return state
  }
}

export function getRef(state = {}, action) {
  switch (action.type) {
    case maintainReferenceDataConstants.GET_MAINTAIN_REFERENCE_DATA_REQUEST:
      return { getData: false }
    case maintainReferenceDataConstants.GET_MAINTAIN_REFERENCE_DATA_SUCCESS:
      return { getData: action.data }
    case maintainReferenceDataConstants.GET_MAINTAIN_REFERENCE_DATA_FAILURE:
      return { getData: false }
    default:
      return state
  }
}

export function getRefAll(state = {}, action) {
  switch (action.type) {
    case maintainReferenceDataConstants.GET_MAINTAIN_REFERENCE_ALL_DATA_REQUEST:
      return { getData: false }
    case maintainReferenceDataConstants.GET_MAINTAIN_REFERENCE_ALL_DATA_SUCCESS:
      return { getData: action.data }
    case maintainReferenceDataConstants.GET_MAINTAIN_REFERENCE_ALL_DATA_FAILURE:
      return { getData: false }
    default:
      return state
  }
}
export function getMasterRef(state = {}, action) {
  switch (action.type) {
    case maintainReferenceDataConstants.GET_MAINTAIN_MASTER_REFERENCE_DATA_REQUEST:
      return { getData: false }
    case maintainReferenceDataConstants.GET_MAINTAIN_MASTER_REFERENCE_DATA_SUCCESS:
      return { getData: action.data }
    case maintainReferenceDataConstants.GET_MAINTAIN_MASTER_REFERENCE_DATA_FAILURE:
      return { getData: false }
    default:
      return state
  }
}
