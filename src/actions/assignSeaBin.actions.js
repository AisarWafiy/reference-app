import { assignSeaBinConstants } from 'constants/actions.type.constant/assignSeaBin.constants'
import { assignSeaBinServices } from 'services/assignSeaBin.service'
import { alertActions } from './alert.actions'
import * as labels from 'constants/labels'
export const assignSeaBinActions = {
  assignSeaBin,
}

function assignSeaBin(data) {
  return dispatch => {
    dispatch(request({ data }))
    assignSeaBinServices.assignSeaBin(data).then(
      data => {
        dispatch(success(data))
        dispatch(alertActions.success(data.message, labels.assignSeaBin))
      },
      error => {
        dispatch(failure(error))
        if (error.error && !error.record)
          dispatch(alertActions.error(error.error, labels.assignSeaBin))
        else if (error.error && error.record)
          dispatch(alertActions.error(error.record, labels.assignSeaBin))
        else if (error.warning) dispatch(alertActions.warning(error.warning, labels.assignSeaBin))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return { type: assignSeaBinConstants.ASSIGN_SEA_BIN_REQUEST, data }
  }
  function success(data) {
    return { type: assignSeaBinConstants.ASSIGN_SEA_BIN_SUCCESS, data }
  }
  function failure(data) {
    return { type: assignSeaBinConstants.ASSIGN_SEA_BIN_FAILURE, data }
  }
}
