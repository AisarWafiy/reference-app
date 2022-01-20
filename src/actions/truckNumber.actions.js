import { truckNumberConstants } from 'constants/actions.type.constant/truckNumber.constants'
import { truckNumberServices } from 'services/truckNumber.service'

export const truckNumberActions = {
  getTruckNumber,
  getSeaBinTruck,
}

function getTruckNumber(data) {
  return dispatch => {
    dispatch(request({ data }))
    truckNumberServices.getTruckNumber(data).then(
      data => {
        dispatch(success(data))
      },
      error => {
        dispatch(failure(error.message))
      },
    )
  }
  function request(data) {
    return { type: truckNumberConstants.GET_TRUCK_REQUEST, data }
  }
  function success(data) {
    return { type: truckNumberConstants.GET_TRUCK_SUCCESS, data }
  }
  function failure(data) {
    return { type: truckNumberConstants.GET_TRUCK_FAILURE, data }
  }
}

function getSeaBinTruck(data) {
  return dispatch => {
    dispatch(request({ data }))
    truckNumberServices.getSeaBinTruck(data).then(
      data => {
        dispatch(success(data))
      },
      error => {
        dispatch(failure(error.message))
      },
    )
  }
  function request(data) {
    return { type: truckNumberConstants.GET_SEABIN_TRUCK_REQUEST, data }
  }
  function success(data) {
    return { type: truckNumberConstants.GET_SEABIN_TRUCK_SUCCESS, data }
  }
  function failure(data) {
    return { type: truckNumberConstants.GET_SEABIN_TRUCK_FAILURE, data }
  }
}
