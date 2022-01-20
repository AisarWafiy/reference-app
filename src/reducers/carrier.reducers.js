import { carrierConstants } from 'constants/actions.type.constant/carrier.constants'

export function getAllCarrier(state = {}, action) {
  switch (action.type) {
    case carrierConstants.GET_ALL_CARRIER_REQUEST:
      return { getData: false }
    case carrierConstants.GET_ALL_CARRIER_SUCCESS:
      return { getData: action.data }
    case carrierConstants.GET_ALL_CARRIER_FAILURE:
      return { getData: false }
    default:
      return state
  }
}

export function postFilterCarrier(state = {}, action) {
  switch (action.type) {
    case carrierConstants.POST_FILTER_CARRIER_REQUEST:
      return { getData: false }
    case carrierConstants.POST_FILTER_CARRIER_SUCCESS:
      return { getData: action.data }
    case carrierConstants.POST_FILTER_CARRIER_FAILURE:
      return { getData: action.data }
    default:
      return state
  }
}

export function updateSellOff(state = {}, action) {
  switch (action.type) {
    case carrierConstants.UPDATE_SELL_OFF_REQUEST:
      return { getData: false }
    case carrierConstants.UPDATE_SELL_OFF_SUCCESS:
      return { getData: action.data }
    case carrierConstants.UPDATE_SELL_OFF_FAILURE:
      return { getData: action.data }
    default:
      return state
  }
}

export function getCarrierStatus(state = {}, action) {
  switch (action.type) {
    case carrierConstants.GET_CARRIER_STATUS_REQUEST:
      return { getData: false }
    case carrierConstants.GET_CARRIER_STATUS_SUCCESS:
      return { getData: action.data }
    case carrierConstants.GET_CARRIER_STATUS_FAILURE:
      return { getData: false }
    default:
      return state
  }
}
export function postCarrier(state = {}, action) {
  switch (action.type) {
    case carrierConstants.POST_CARRIER_REQUEST:
      return { getData: false }
    case carrierConstants.POST_CARRIER_SUCCESS:
      return { getData: action.data }
    case carrierConstants.POST_CARRIER_FAILURE:
      return { getData: action.data }
    default:
      return state
  }
}

export function maintainCarrier(state = {}, action) {
  switch (action.type) {
    case carrierConstants.MAINTAIN_CARRIER_REQUEST:
      return { getData: false }
    case carrierConstants.MAINTAIN_CARRIER_SUCCESS:
      return { getData: action.data }
    case carrierConstants.MAINTAIN_CARRIER_FAILURE:
      return { getData: action.data }
    default:
      return state
  }
}
