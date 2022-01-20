import { linkConstants } from '../constants/actions.type.constant/link.constants'

export const linkActions = {
  linksuccess,
}

function linksuccess(data) {
  return {
    type: linkConstants.linksuccess,
    payload: data,
  }
}
