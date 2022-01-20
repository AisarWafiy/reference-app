import { linkConstants } from 'constants/actions.type.constant/link.constants'

const INIT_STATE = null

export function linksuccess(state = INIT_STATE, action) {
  switch (action.type) {
    case linkConstants.linksuccess:
      return action.payload

    default:
      return state
  }
}
