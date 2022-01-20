import { cageConstants } from 'constants/actions.type.constant/cage.constants'
import { cageServices } from 'services/cage.service'
import { alertActions } from './alert.actions'
import * as labels from 'constants/labels'
export const cageActions = {
  postCage,
  deleteCage,
  getCage,
  getAllCage,
  updateCage,
}
function postCage(data) {
  return dispatch => {
    dispatch(request({ data }))
    cageServices.postCage(data).then(
      data => {
        dispatch(success(data))
        dispatch(alertActions.success(data.message, labels.CreateCage))
      },
      error => {
        dispatch(failure(error))
        if (error.error && !error.record)
          dispatch(alertActions.error(error.error, labels.CreateCage))
        else if (error.error && error.record)
          dispatch(alertActions.error(error.record, labels.CreateCage))
        else if (error.warning) dispatch(alertActions.warning(error.warning, labels.CreateCage))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return { type: cageConstants.POST_CAGE_REQUEST, data }
  }
  function success(data) {
    return { type: cageConstants.POST_CAGE_SUCCESS, data }
  }
  function failure(data) {
    return { type: cageConstants.POST_CAGE_FAILURE, data }
  }
}
function updateCage(data) {
  return dispatch => {
    dispatch(request({ data }))
    cageServices.updateCage(data).then(
      data => {
        dispatch(success(data))
        dispatch(alertActions.success(data.message, labels.UpdateCage))
      },
      error => {
        dispatch(failure(error))
        if (error.error && !error.record)
          dispatch(alertActions.error(error.error, labels.UpdateCage))
        else if (error.error && error.record)
          dispatch(alertActions.error(error.record, labels.UpdateCage))
        else if (error.warning) dispatch(alertActions.warning(error.warning, labels.UpdateCage))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return { type: cageConstants.POST_CAGE_REQUEST, data }
  }
  function success(data) {
    return { type: cageConstants.POST_CAGE_SUCCESS, data }
  }
  function failure(data) {
    return { type: cageConstants.POST_CAGE_FAILURE, data }
  }
}
function getCage(data) {
  return dispatch => {
    dispatch(request({ data }))
    cageServices.getCage(data).then(
      data => {
        dispatch(success(data))
      },
      error => {
        dispatch(failure(error))
        if (error.error && !error.record)
          dispatch(alertActions.error(error.error, labels.UpdateCage))
        else if (error.error && error.record)
          dispatch(alertActions.error(error.record, labels.UpdateCage))
        else if (error.warning) dispatch(alertActions.warning(error.warning, labels.UpdateCage))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return { type: cageConstants.GET_CAGE_REQUEST, data }
  }
  function success(data) {
    return { type: cageConstants.GET_CAGE_SUCCESS, data }
  }
  function failure(data) {
    return { type: cageConstants.GET_CAGE_FAILURE, data }
  }
}

function getAllCage(data) {
  return dispatch => {
    dispatch(request({ data }))
    cageServices.getAllCage(data).then(
      data => {
        dispatch(success(data))
      },
      error => {
        dispatch(failure(error))
      },
    )
  }
  function request(data) {
    return { type: cageConstants.GET_ALL_CAGE_REQUEST, data }
  }
  function success(data) {
    return { type: cageConstants.GET_ALL_CAGE_SUCCESS, data }
  }
  function failure(data) {
    return { type: cageConstants.GET_ALL_CAGE_FAILURE, data }
  }
}

function deleteCage(data) {
  return dispatch => {
    dispatch(request({ data }))
    cageServices.deleteCage(data).then(
      data => {
        dispatch(success(data))
        dispatch(alertActions.success(data.message, labels.UpdateCage))
      },
      error => {
        dispatch(failure(error))
        if (error.error && !error.record)
          dispatch(alertActions.error(error.error, labels.UpdateCage))
        else if (error.error && error.record)
          dispatch(alertActions.error(error.record, labels.UpdateCage))
        else if (error.warning) dispatch(alertActions.warning(error.warning, labels.UpdateCage))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return { type: cageConstants.DELETE_CAGE_REQUEST, data }
  }
  function success(data) {
    return { type: cageConstants.DELETE_CAGE_SUCCESS, data }
  }
  function failure(data) {
    return { type: cageConstants.DELETE_CAGE_FAILURE, data }
  }
}
