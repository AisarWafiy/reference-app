import { picklistConstants } from 'constants/actions.type.constant/picklist.constants'
import { picklistServices } from 'services/picklist.service'
import { alertActions } from './alert.actions'
import * as labels from 'constants/labels'
export const picklistActions = {
  getPicklist,
  printPicklist,
  getDrop,
}

function getDrop(data) {
  return dispatch => {
    dispatch(request({ data }))
    picklistServices.getDrop(data).then(
      data => {
        dispatch(success(data))
      },
      error => {
        dispatch(failure(error.message))
      },
    )
  }
  function request(data) {
    return { type: picklistConstants.GET_DROP_REQUEST, data }
  }
  function success(data) {
    return { type: picklistConstants.GET_DROP_SUCCESS, data }
  }
  function failure(data) {
    return { type: picklistConstants.GET_DROP_FAILURE, data }
  }
}

function getPicklist(data) {
  return dispatch => {
    dispatch(request({ data }))
    picklistServices.getPicklist(data).then(
      data => {
        dispatch(success(data))
        dispatch(alertActions.success(data.message, labels.picklist))
      },
      error => {
        dispatch(failure(error))
        if (error.error && !error.record) dispatch(alertActions.error(error.error, labels.picklist))
        else if (error.error && error.record)
          dispatch(alertActions.error(error.record, labels.picklist))
        else if (error.warning) dispatch(alertActions.warning(error.warning, labels.picklist))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return { type: picklistConstants.GET_PICKLIST_REQUEST, data }
  }
  function success(data) {
    return { type: picklistConstants.GET_PICKLIST_SUCCESS, data }
  }
  function failure(data) {
    return { type: picklistConstants.GET_PICKLIST_FAILURE, data }
  }
}

function printPicklist(data) {
  return dispatch => {
    dispatch(request({ data }))
    picklistServices.printPicklist(data).then(
      data => {
        dispatch(success(data))
        dispatch(alertActions.success(data.message, labels.picklist))
      },
      error => {
        dispatch(failure(error))
        if (error.error && !error.record) dispatch(alertActions.error(error.error, labels.picklist))
        else if (error.error && error.record)
          dispatch(alertActions.error(error.record, labels.picklist))
        else if (error.warning) dispatch(alertActions.warning(error.warning, labels.picklist))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return { type: picklistConstants.PRINT_PICKLIST_REQUEST, data }
  }
  function success(data) {
    return { type: picklistConstants.PRINT_PICKLIST_SUCCESS, data }
  }
  function failure(data) {
    return { type: picklistConstants.PRINT_PICKLIST_FAILURE, data }
  }
}
