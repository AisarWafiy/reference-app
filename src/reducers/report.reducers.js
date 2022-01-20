import { reportConstants } from 'constants/actions.type.constant/report.constants'

const INIT_STATE = null

export function reportsuccess(state = INIT_STATE, action) {
  switch (action.type) {
    case reportConstants.reportsuccess:
      return action.payload

    default:
      return state
  }
}
