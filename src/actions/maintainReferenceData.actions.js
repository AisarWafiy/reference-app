import { maintainReferenceDataConstants } from 'constants/actions.type.constant/maintainReferenceData.constants'
import { maintainReferenceDataServices } from 'services/maintainReferenceData.service'
import { alertActions } from './alert.actions'
import * as labels from 'constants/labels'

export const maintainReferenceDataActions = {
  getRef,
  postRef,
  getRefAll,
  getMasterRef,
}

function getRefAll(data) {
  return dispatch => {
    dispatch(request({ data }))
    maintainReferenceDataServices.getRefAll(data).then(
      data => {
        dispatch(success(data))
      },
      error => {
        dispatch(failure(error.message))
      },
    )
  }
  function request(data) {
    return { type: maintainReferenceDataConstants.GET_MAINTAIN_REFERENCE_ALL_DATA_REQUEST, data }
  }
  function success(data) {
    return { type: maintainReferenceDataConstants.GET_MAINTAIN_REFERENCE_ALL_DATA_SUCCESS, data }
  }
  function failure(data) {
    return { type: maintainReferenceDataConstants.GET_MAINTAIN_REFERENCE_ALL_DATA_FAILURE, data }
  }
}

function getRef(data) {
  return dispatch => {
    dispatch(request({ data }))
    maintainReferenceDataServices.getRef(data).then(
      data => {
        dispatch(success(data))
      },
      error => {
        dispatch(failure(error.message))
      },
    )
  }
  function request(data) {
    return { type: maintainReferenceDataConstants.GET_MAINTAIN_REFERENCE_DATA_REQUEST, data }
  }
  function success(data) {
    return { type: maintainReferenceDataConstants.GET_MAINTAIN_REFERENCE_DATA_SUCCESS, data }
  }
  function failure(data) {
    return { type: maintainReferenceDataConstants.GET_MAINTAIN_REFERENCE_DATA_FAILURE, data }
  }
}

function getMasterRef(data) {
  return dispatch => {
    dispatch(request({ data }))
    maintainReferenceDataServices.getMasterRef(data).then(
      data => {
        dispatch(success(data))
      },
      error => {
        dispatch(failure(error.message))
      },
    )
  }
  function request(data) {
    return { type: maintainReferenceDataConstants.GET_MAINTAIN_MASTER_REFERENCE_DATA_REQUEST, data }
  }
  function success(data) {
    return { type: maintainReferenceDataConstants.GET_MAINTAIN_MASTER_REFERENCE_DATA_SUCCESS, data }
  }
  function failure(data) {
    return { type: maintainReferenceDataConstants.GET_MAINTAIN_MASTER_REFERENCE_DATA_FAILURE, data }
  }
}

function postRef(data) {
  return dispatch => {
    dispatch(request({ data }))
    maintainReferenceDataServices.postRef(data).then(
      data => {
        dispatch(success(data))
        dispatch(alertActions.success(data.message, labels.MaintainReferenceData))
      },
      error => {
        dispatch(failure(error.message))
        if (error.error && !error.record)
          dispatch(alertActions.error(error.error, labels.MaintainReferenceData))
        else if (error.error && error.record)
          dispatch(alertActions.error(error.record, labels.MaintainReferenceData))
        else if (error.warning)
          dispatch(alertActions.warning(error.warning, labels.MaintainReferenceData))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return { type: maintainReferenceDataConstants.POST_MAINTAIN_REFERENCE_DATA_REQUEST, data }
  }
  function success(data) {
    return { type: maintainReferenceDataConstants.POST_MAINTAIN_REFERENCE_DATA_SUCCESS, data }
  }
  function failure(data) {
    return { type: maintainReferenceDataConstants.POST_MAINTAIN_REFERENCE_DATA_FAILURE, data }
  }
}
