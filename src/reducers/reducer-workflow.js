const initialState = {
  state: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'workflow': {
      return {
        ...state,
        current: action.workflow,
      }
    }

    default:
      return state
  }
}
