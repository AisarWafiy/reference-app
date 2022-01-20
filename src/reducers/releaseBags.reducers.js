import { releaseBagsConstants } from 'constants/actions.type.constant/releaseBags.constants'

export function getBags(state = {}, action) {
  switch (action.type) {
    case releaseBagsConstants.GET_BAGS_REQUEST:
      return { getData: false }
    case releaseBagsConstants.GET_BAGS_SUCCESS:
      return { getData: action.data }
    case releaseBagsConstants.GET_BAGS_FAILURE:
      return { getData: action.data }
    default:
      return state
  }
}

export function releaseBags(state = {}, action) {
  switch (action.type) {
    case releaseBagsConstants.RELEASE_BAGS_REQUEST:
      return { getData: false }
    case releaseBagsConstants.RELEASE_BAGS_SUCCESS:
      return { getData: action.data }
    case releaseBagsConstants.RELEASE_BAGS_FAILURE:
      return { getData: action.data }
    default:
      return state
  }
}
