import { reportConstants } from '../constants/actions.type.constant/report.constants'

export const reportActions = {
  reportsuccess,
}

function reportsuccess(data) {
  return {
    type: reportConstants.reportsuccess,
    payload: data,
  }
}
