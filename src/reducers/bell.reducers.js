import { bellConstants } from 'constants/actions.type.constant/bell.constants'

const INIT_STATE = 0

export function bellRefund(state = INIT_STATE, action) {
  switch (action.type) {
    case bellConstants.bellRefund:
      return action.payload

    default:
      return state
  }
}
export function bellFLight(state = INIT_STATE, action) {
  switch (action.type) {
    case bellConstants.bellFlight:
      return action.payload

    default:
      return state
  }
}
