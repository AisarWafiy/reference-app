import { overrideBagtrackingConstants } from 'constants/actions.type.constant/overrideBagtracking.constants'
import { overrideBagtrackingServices } from 'services/overrideBagtracking.service'
import { alertActions } from './alert.actions'
import * as labels from 'constants/labels'
export const overrideBagtrackingActions = {
  bagtrackAirport,
  bagtrackWarehouse,
}

function bagtrackAirport(data) {
  return dispatch => {
    dispatch(request({ data }))
    overrideBagtrackingServices.bagtrackAirport(data).then(
      data => {
        dispatch(success(data))
        dispatch(alertActions.success(data.message, labels.overrideBagtracking))
      },
      error => {
        dispatch(failure(error))

        if (error.error && !error.record)
          dispatch(alertActions.error(error.error, labels.overrideBagtracking))
        else if (error.error && error.record)
          dispatch(alertActions.error(error.record, labels.overrideBagtracking))
        else if (error.warning)
          dispatch(alertActions.warning(error.warning, labels.overrideBagtracking))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return { type: overrideBagtrackingConstants.BAGTRACK_AIRPORT_REQUEST, data }
  }
  function success(data) {
    return { type: overrideBagtrackingConstants.BAGTRACK_AIRPORT_SUCCESS, data }
  }
  function failure(data) {
    return { type: overrideBagtrackingConstants.BAGTRACK_AIRPORT_FAILURE, data }
  }
}

function bagtrackWarehouse(data) {
  return dispatch => {
    dispatch(request({ data }))
    overrideBagtrackingServices.bagtrackWarehouse(data).then(
      data => {
        dispatch(success(data))
        dispatch(alertActions.success(data.message, labels.overrideBagtracking))
      },
      error => {
        dispatch(failure(error))

        if (error.error && !error.record)
          dispatch(alertActions.error(error.error, labels.overrideBagtracking))
        else if (error.error && error.record)
          dispatch(alertActions.error(error.record, labels.overrideBagtracking))
        else if (error.warning)
          dispatch(alertActions.warning(error.warning, labels.overrideBagtracking))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return { type: overrideBagtrackingConstants.BAGTRACK_WAREHOUSE_REQUEST, data }
  }
  function success(data) {
    return { type: overrideBagtrackingConstants.BAGTRACK_WAREHOUSE_SUCCESS, data }
  }
  function failure(data) {
    return { type: overrideBagtrackingConstants.BAGTRACK_WAREHOUSE_FAILURE, data }
  }
}
