import { carrierConstants } from 'constants/actions.type.constant/carrier.constants'
import { carrierServices } from 'services/carrier.service'
import { alertActions } from './alert.actions'
import * as labels from 'constants/labels'
import i18next from 'i18next'
export const carrierActions = {
  getAllCarrier,
  getCarrierStatus,
  postCarrier,
  maintainCarrier,
  postFilterCarrier,
  updateSellOff,
}
function getAllCarrier(data) {
  return dispatch => {
    dispatch(request({ data }))
    carrierServices.getAllCarrier(data).then(
      data => {
        dispatch(success(data))
      },
      error => {
        dispatch(failure(error.Message))
      },
    )
  }
  function request(data) {
    return { type: carrierConstants.GET_ALL_CARRIER_REQUEST, data }
  }
  function success(data) {
    return { type: carrierConstants.GET_ALL_CARRIER_SUCCESS, data }
  }
  function failure(data) {
    return { type: carrierConstants.GET_ALL_CARRIER_FAILURE, data }
  }
}

function updateSellOff(data) {
  return dispatch => {
    dispatch(request({ data }))
    carrierServices.updateSellOff(data).then(
      data => {
        dispatch(success(data))
        dispatch(alertActions.success(data.message, labels.MaintainCarrier))
      },
      error => {
        dispatch(failure(error))
        if (error.error && !error.record)
          dispatch(alertActions.error(error.error, labels.MaintainCarrier))
        else if (error.error && error.record)
          dispatch(alertActions.error(error.record, labels.MaintainCarrier))
        else if (error.warning)
          dispatch(alertActions.warning(error.warning, labels.MaintainCarrier))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return { type: carrierConstants.UPDATE_SELL_OFF_REQUEST, data }
  }
  function success(data) {
    return { type: carrierConstants.UPDATE_SELL_OFF_SUCCESS, data }
  }
  function failure(data) {
    return { type: carrierConstants.UPDATE_SELL_OFF_FAILURE, data }
  }
}

function postFilterCarrier(data) {
  return dispatch => {
    dispatch(request({ data }))
    carrierServices.postFilterCarrier(data).then(
      data => {
        dispatch(success(data))
      },
      error => {
        dispatch(failure(error))
        if (error.error && !error.record)
          dispatch(alertActions.error(error.error, labels.MaintainCarrier))
        else if (error.error && error.record)
          dispatch(alertActions.error(error.record, labels.MaintainCarrier))
        else if (error.warning)
          dispatch(alertActions.warning(error.warning, labels.MaintainCarrier))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return { type: carrierConstants.POST_FILTER_CARRIER_REQUEST, data }
  }
  function success(data) {
    return { type: carrierConstants.POST_FILTER_CARRIER_SUCCESS, data }
  }
  function failure(data) {
    return { type: carrierConstants.POST_FILTER_CARRIER_FAILURE, data }
  }
}

function getCarrierStatus(data) {
  return dispatch => {
    dispatch(request({ data }))
    carrierServices.getCarrierStatus(data).then(
      data => {
        dispatch(success(data))
      },
      error => {
        dispatch(failure(error.Message))
      },
    )
  }
  function request(data) {
    return { type: carrierConstants.GET_CARRIER_STATUS_REQUEST, data }
  }
  function success(data) {
    return { type: carrierConstants.GET_CARRIER_STATUS_SUCCESS, data }
  }
  function failure(data) {
    return { type: carrierConstants.GET_CARRIER_STATUS_FAILURE, data }
  }
}

function postCarrier(data) {
  return dispatch => {
    dispatch(request({ data }))
    carrierServices.postCarrier(data).then(
      data => {
        dispatch(success(data))
        if (data.result.errorScheduleTimes && data.result.errorScheduleTimes.length > 0) {
          let a = data.result.errorScheduleTimes.map(item => {
            let from = item.departureFromTm.split(' ')
            let to = item.departureToTm.split(' ')
            return from[0] + i18next.t('To_label') + to[0]
          })

          dispatch(
            alertActions.success(
              i18next.t(data.message) +
                ' ' +
                i18next.t('but cannot be created for date range ') +
                a,
              labels.MaintainCarrier,
            ),
          )
        } else {
          dispatch(alertActions.success(data.message, labels.CreateCarrier))
        }
      },
      error => {
        dispatch(failure(error))
        if (error.error && !error.record)
          dispatch(alertActions.error(error.error, labels.CreateCarrier))
        else if (error.error && error.record)
          dispatch(alertActions.error(error.record, labels.CreateCarrier))
        else if (error.warning) dispatch(alertActions.warning(error.warning, labels.CreateCarrier))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return { type: carrierConstants.POST_CARRIER_REQUEST, data }
  }
  function success(data) {
    return { type: carrierConstants.POST_CARRIER_SUCCESS, data }
  }
  function failure(data) {
    return { type: carrierConstants.POST_CARRIER_FAILURE, data }
  }
}

function maintainCarrier(data) {
  return dispatch => {
    dispatch(request({ data }))
    carrierServices.maintainCarrier(data).then(
      data => {
        dispatch(success(data))
        dispatch(alertActions.success(data.message, labels.MaintainCarrier))
      },
      error => {
        dispatch(failure(error))
        if (error.error && !error.record)
          dispatch(alertActions.error(error.error, labels.MaintainCarrier))
        else if (error.error && error.record)
          dispatch(alertActions.error(error.record, labels.MaintainCarrier))
        else if (error.warning)
          dispatch(alertActions.warning(error.warning, labels.MaintainCarrier))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return { type: carrierConstants.MAINTAIN_CARRIER_REQUEST, data }
  }
  function success(data) {
    return { type: carrierConstants.MAINTAIN_CARRIER_SUCCESS, data }
  }
  function failure(data) {
    return { type: carrierConstants.MAINTAIN_CARRIER_FAILURE, data }
  }
}
