import { bellConstants } from '../constants/actions.type.constant/bell.constants'

export const bellActions = {
  bellFLight,
  bellRefund,
}

function bellFLight(data) {
  return {
    type: bellConstants.bellFlight,
    payload: data,
  }
}
function bellRefund(data) {
  return {
    type: bellConstants.bellRefund,
    payload: data,
  }
}
