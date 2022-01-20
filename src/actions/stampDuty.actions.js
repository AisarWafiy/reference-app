import { stampDutyConstants } from 'constants/actions.type.constant/stampDuty.constants'
import { stampDutyServices } from 'services/stampDuty.service'
import { alertActions } from './alert.actions'
import * as labels from 'constants/labels'
export const stampDutyActions = {
  getstampDuty,
  getLocationId,
  getMonth,
}

function getstampDuty(data) {
  return dispatch => {
    dispatch(request({ data }))
    stampDutyServices.getstampDuty(data).then(
      data => {
        dispatch(success(data))
        dispatch(alertActions.success(data.message, labels.stampDuty))
      },
      error => {
        dispatch(failure(error))
        if (error.error && !error.record)
          dispatch(alertActions.error(error.error, labels.stampDuty))
        else if (error.error && error.record)
          dispatch(alertActions.error(error.record, labels.stampDuty))
        else if (error.warning) dispatch(alertActions.warning(error.warning, labels.stampDuty))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return { type: stampDutyConstants.GET_STAMPDUTY_REQUEST, data }
  }
  function success(data) {
    return { type: stampDutyConstants.GET_STAMPDUTY_SUCCESS, data }
  }
  function failure(data) {
    return { type: stampDutyConstants.GET_STAMPDUTY_FAILURE, data }
  }
}

function getLocationId(data) {
  return dispatch => {
    dispatch(request({ data }))
    stampDutyServices.getLocationId(data).then(
      data => {
        dispatch(success(data))
      },
      error => {
        dispatch(failure(error.message))
        if (error.error && !error.record)
          dispatch(alertActions.error(error.error, labels.stampDuty))
        else if (error.error && error.record)
          dispatch(alertActions.error(error.record, labels.stampDuty))
        else if (error.warning) dispatch(alertActions.warning(error.warning, labels.stampDuty))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return { type: stampDutyConstants.GET_LOCATION_REQUEST, data }
  }
  function success(data) {
    return { type: stampDutyConstants.GET_LOCATION_SUCCESS, data }
  }
  function failure(data) {
    return { type: stampDutyConstants.GET_LOCATION_FAILURE, data }
  }
}

function getMonth(data) {
  return dispatch => {
    dispatch(request({ data }))
    stampDutyServices.getMonth(data).then(
      data => {
        dispatch(success(data))
      },
      error => {
        dispatch(failure(error.message))
        if (error.error && !error.record)
          dispatch(alertActions.error(error.error, labels.stampDuty))
        else if (error.error && error.record)
          dispatch(alertActions.error(error.record, labels.stampDuty))
        else if (error.warning) dispatch(alertActions.warning(error.warning, labels.stampDuty))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return { type: stampDutyConstants.GET_MONTH_REQUEST, data }
  }
  function success(data) {
    return { type: stampDutyConstants.GET_MONTH_SUCCESS, data }
  }
  function failure(data) {
    return { type: stampDutyConstants.GET_MONTH_FAILURE, data }
  }
}
