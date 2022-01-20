import { maintainUserDataConstants } from 'constants/actions.type.constant/maintainUserData.constants'
import { maintainUserDataServices } from 'services/maintainUser.service'
import { alertActions } from './alert.actions'
import * as labels from 'constants/labels'
export const maintainUserDataActions = {
  getUser,
  postUser,
  getRole,
}

function getRole(data) {
  return dispatch => {
    dispatch(request({ data }))
    maintainUserDataServices.getRole(data).then(
      data => {
        dispatch(success(data))
      },
      error => {
        dispatch(failure(error.message))
      },
    )
  }
  function request(data) {
    return { type: maintainUserDataConstants.GET_MAINTAIN_USER_ROLES_DATA_REQUEST, data }
  }
  function success(data) {
    return { type: maintainUserDataConstants.GET_MAINTAIN_USER_ROLES_DATA_SUCCESS, data }
  }
  function failure(data) {
    return { type: maintainUserDataConstants.GET_MAINTAIN_USER_ROLES_DATA_FAILURE, data }
  }
}

function getUser(data) {
  return dispatch => {
    dispatch(request({ data }))
    maintainUserDataServices.getUser(data).then(
      data => {
        dispatch(success(data))
      },
      error => {
        dispatch(failure(error.message))
      },
    )
  }
  function request(data) {
    return { type: maintainUserDataConstants.GET_MAINTAIN_USER_DATA_REQUEST, data }
  }
  function success(data) {
    return { type: maintainUserDataConstants.GET_MAINTAIN_USER_DATA_SUCCESS, data }
  }
  function failure(data) {
    return { type: maintainUserDataConstants.GET_MAINTAIN_USER_DATA_FAILURE, data }
  }
}

function postUser(data) {
  return dispatch => {
    dispatch(request({ data }))
    maintainUserDataServices.postUser(data).then(
      data => {
        dispatch(success(data))
        dispatch(alertActions.success(data.message, labels.MaintainUsers))
      },
      error => {
        dispatch(failure(error.Message))
        if (error.error && !error.record)
          dispatch(alertActions.error(error.error, labels.MaintainUsers))
        else if (error.error && error.record)
          dispatch(alertActions.error(error.record, labels.MaintainUsers))
        else if (error.warning) dispatch(alertActions.warning(error.warning, labels.MaintainUsers))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return { type: maintainUserDataConstants.POST_MAINTAIN_USER_DATA_REQUEST, data }
  }
  function success(data) {
    return { type: maintainUserDataConstants.POST_MAINTAIN_USER_DATA_SUCCESS, data }
  }
  function failure(data) {
    return { type: maintainUserDataConstants.POST_MAINTAIN_USER_DATA_FAILURE, data }
  }
}
