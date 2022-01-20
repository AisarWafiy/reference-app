import { releaseBagsConstants } from 'constants/actions.type.constant/releaseBags.constants'
import { releaseBagsServices } from 'services/releaseBags.service'
import { alertActions } from './alert.actions'
import * as labels from 'constants/labels'
export const releaseBagsActions = {
  getBags,
  releaseBags,
}

function getBags(data) {
  return dispatch => {
    dispatch(request({ data }))
    releaseBagsServices.getBags(data).then(
      data => {
        dispatch(success(data))
      },
      error => {
        dispatch(failure(error))
        if (error.error && !error.record)
          dispatch(alertActions.error(error.error, labels.releaseBags))
        else if (error.error && error.record)
          dispatch(alertActions.error(error.record, labels.releaseBags))
        else if (error.warning) dispatch(alertActions.warning(error.warning, labels.releaseBags))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return { type: releaseBagsConstants.GET_BAGS_REQUEST, data }
  }
  function success(data) {
    return { type: releaseBagsConstants.GET_BAGS_SUCCESS, data }
  }
  function failure(data) {
    return { type: releaseBagsConstants.GET_BAGS_FAILURE, data }
  }
}

function releaseBags(data) {
  return dispatch => {
    dispatch(request({ data }))
    releaseBagsServices.releaseBags(data).then(
      data => {
        dispatch(success(data))
        dispatch(alertActions.success(data.message, labels.releaseBags))
      },
      error => {
        dispatch(failure(error))
        if (error.error && !error.record)
          dispatch(alertActions.error(error.error, labels.releaseBags))
        else if (error.error && error.record)
          dispatch(alertActions.error(error.record, labels.releaseBags))
        else if (error.warning) dispatch(alertActions.warning(error.warning, labels.releaseBags))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return { type: releaseBagsConstants.RELEASE_BAGS_REQUEST, data }
  }
  function success(data) {
    return { type: releaseBagsConstants.RELEASE_BAGS_SUCCESS, data }
  }
  function failure(data) {
    return { type: releaseBagsConstants.RELEASE_BAGS_FAILURE, data }
  }
}
