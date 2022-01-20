import { SET_ALL_TRUCK, COLUMN_EDIT } from 'actions/action-truck'

const initialState = {
  allTruck: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_TRUCK:
      return {
        ...state,
        allTruck: action.payload,
      }

    case COLUMN_EDIT: {
      return console.log(action.payload)
    }
    // FOR EACH COLUMN EDITED, CHECK IF ANYTHING CHANGED
    // POST CHANGES TO NEW STATE
    //   if (action.payload.oldValue !== action.payload.newValue) {
    //     const account = 'acct01'
    //     const column = action.payload.colDef.field
    //     const index = state[account].allTruck.findIndex(
    //       t => t.transaction_id === action.payload.t.transaction_id,
    //     )
    //     return produce(state, draft => {
    //       const allTruck = draft[account].allTruck[index]
    //       allTruck[column] = action.payload.newValue
    //     })
    //   }
    // }

    default:
      return state
  }
}
