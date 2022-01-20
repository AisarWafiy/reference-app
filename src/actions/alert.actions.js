import { alertConstants } from '../constants/actions.type.constant/alert.constants'

export const alertActions = {
  success,
  error,
  info,
  warning,
}

function success(message, title) {
  return {
    type: alertConstants.success,
    payload: { type: alertConstants.success, message, title },
  }
}

function error(message, title) {
  return {
    type: alertConstants.error,
    payload: { type: alertConstants.error, message, title },
  }
}

function info(message, title) {
  return {
    type: alertConstants.info,
    payload: { type: alertConstants.info, message, title },
  }
}

function warning(message, title) {
  return {
    type: alertConstants.warning,
    payload: { type: alertConstants.warning, message, title },
  }
}
