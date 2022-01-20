import { bagStatusFlightConstants } from 'constants/actions.type.constant/bagStatusFlight.constants'
import { bagStatusFlightServices } from 'services/bagStatusFlight.service'
import { alertActions } from './alert.actions'
import * as labels from 'constants/labels'
export const bagStatusFlightActions = {
  getBagStatusFlight,
  getCarrierCode,
  formValueBagStatusFlight,
}
function formValueBagStatusFlight(data) {
  return {
    type: bagStatusFlightConstants.formValueBagStatusFlight,
    payload: data,
  }
}
function getBagStatusFlight(data) {
  return dispatch => {
    dispatch(request({ data }))
    bagStatusFlightServices.getBagStatusFlight(data).then(
      data => {
        dispatch(success(data))
        dispatch(alertActions.success(data.message, labels.bagStatusFlight))
      },
      error => {
        dispatch(failure(error))
        if (error.error && !error.record)
          dispatch(alertActions.error(error.error, labels.bagStatusFlight))
        else if (error.error && error.record)
          dispatch(alertActions.error(error.record, labels.bagStatusFlight))
        else if (error.warning)
          dispatch(alertActions.warning(error.warning, labels.bagStatusFlight))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return { type: bagStatusFlightConstants.GET_BAG_STATUS_FLIGHT_REQUEST, data }
  }
  function success(data) {
    return { type: bagStatusFlightConstants.GET_BAG_STATUS_FLIGHT_SUCCESS, data }
  }
  function failure(data) {
    return { type: bagStatusFlightConstants.GET_BAG_STATUS_FLIGHT_FAILURE, data }
  }
}

function getCarrierCode(data) {
  return dispatch => {
    dispatch(request({ data }))
    bagStatusFlightServices.getCarrierCode(data).then(
      data => {
        dispatch(success(data))
      },
      error => {
        dispatch(failure(error.message))
      },
    )
  }
  function request(data) {
    return { type: bagStatusFlightConstants.GET_CARRIER_CODE_REQUEST, data }
  }
  function success(data) {
    return { type: bagStatusFlightConstants.GET_CARRIER_CODE_SUCCESS, data }
  }
  function failure(data) {
    return { type: bagStatusFlightConstants.GET_CARRIER_CODE_FAILURE, data }
  }
}
