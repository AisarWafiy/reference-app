import { purchaseEnquiryByPaxConstants } from 'constants/actions.type.constant/purchaseEnquiryByPax.constants'
import { purchaseEnquiryByPaxServices } from 'services/purchaseEnquiryByPax.service'
import { alertActions } from './alert.actions'
import * as labels from 'constants/labels'
export const purchaseEnquiryByPaxActions = {
  getPurchaseEnquiryByPax,
}

function getPurchaseEnquiryByPax(data) {
  return dispatch => {
    dispatch(request({ data }))
    purchaseEnquiryByPaxServices.getPurchaseEnquiryByPax(data).then(
      data => {
        dispatch(success(data))
        dispatch(alertActions.success(data.message, labels.purchaseEnquiryByPax))
      },
      error => {
        dispatch(failure(error))
        if (error.error && !error.record)
          dispatch(alertActions.error(error.error, labels.purchaseEnquiryByPax))
        else if (error.error && error.record)
          dispatch(alertActions.error(error.record, labels.purchaseEnquiryByPax))
        else if (error.warning)
          dispatch(alertActions.warning(error.warning, labels.purchaseEnquiryByPax))
        else dispatch(alertActions.error('Internal Server Error'))
      },
    )
  }
  function request(data) {
    return { type: purchaseEnquiryByPaxConstants.GET_PURCHASE_ENQUIRY_BY_PAX_REQUEST, data }
  }
  function success(data) {
    return { type: purchaseEnquiryByPaxConstants.GET_PURCHASE_ENQUIRY_BY_PAX_SUCCESS, data }
  }
  function failure(data) {
    return { type: purchaseEnquiryByPaxConstants.GET_PURCHASE_ENQUIRY_BY_PAX_FAILURE, data }
  }
}
