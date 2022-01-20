// action types
export const SET_ALL_TRUCK = 'SET_ALL_TRUCK'
export const COLUMN_EDIT = 'COLUMN_EDIT'

export const setAllTruck = values => dispatch => {
  dispatch({
    type: SET_ALL_TRUCK,
    payload: values,
  })
}

export const columnEdit = data => dispatch => {
  dispatch({
    type: SET_ALL_TRUCK,
    payload: data,
  })
}
