import { mergePaxConstants } from 'constants/actions.type.constant/mergePax.constants'
import { mergePaxServices } from 'services/mergePax.service'
import { alertActions } from './alert.actions'
import * as labels from 'constants/labels'
export const mergePaxActions = {
  getPax,
  mergePax,
  getCarr,
}

function getPax(data) {
  return dispatch => {
    dispatch(request({ data }))
    mergePaxServices.getPax(data).then(
      data => {
        dispatch(success(data))
      },
      error => {
        dispatch(failure(error.message))
      },
    )
  }
  function request(data) {
    return { type: mergePaxConstants.GET_PAX_REQUEST, data }
  }
  function success(data) {
    return { type: mergePaxConstants.GET_PAX_SUCCESS, data }
  }
  function failure(data) {
    return { type: mergePaxConstants.GET_PAX_FAILURE, data }
  }
}

function mergePax(data) {
  return dispatch => {
    dispatch(request({ data }))
    mergePaxServices.mergePax(data).then(
      data => {
        dispatch(success(data))
        dispatch(alertActions.success(data.message, labels.mergePax))
      },
      error => {
        dispatch(failure(error.message))
        if (error.error && !error.record) dispatch(alertActions.error(error.error, labels.mergePax))
        else if (error.error && error.record)
          dispatch(alertActions.error(error.record, labels.mergePax))
        else if (error.warning) dispatch(alertActions.warning(error.warning, labels.mergePax))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return { type: mergePaxConstants.POST_PAX_REQUEST, data }
  }
  function success(data) {
    return { type: mergePaxConstants.POST_PAX_SUCCESS, data }
  }
  function failure(data) {
    return { type: mergePaxConstants.POST_PAX_FAILURE, data }
  }
}

function getCarr(data) {
  return dispatch => {
    dispatch(request({ data }))
    mergePaxServices.getCarr(data).then(
      data => {
        dispatch(success(data))
      },
      error => {
        dispatch(failure(error.message))
      },
    )
  }
  function request(data) {
    return { type: mergePaxConstants.GET_CARR_REQUEST, data }
  }
  function success(data) {
    return { type: mergePaxConstants.GET_CARR_SUCCESS, data }
  }
  function failure(data) {
    return { type: mergePaxConstants.GET_CARR_FAILURE, data }
  }
}
