import { alertConstants } from 'constants/actions.type.constant/alert.constants'

const INIT_STATE = {
  type: '',
  message: '',
  title: '',
  alertMe: {},
}

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case alertConstants.success:
    case alertConstants.error:
    case alertConstants.info:
    case alertConstants.warning: {
      return {
        ...state,
        alertMe: action.payload,
      }
    }

    default:
      return state
  }
}
