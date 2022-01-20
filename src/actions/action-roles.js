// action types
export const SET_INPUT_ROLES = 'SET_INPUT_ROLES'
export const SET_INPUT_SCREENS = 'SET_INPUT_SCREENS'
export const SET_MAINTAINED_ROLE = 'SET_ROLE'
export const EDIT_ROLE_NAME = 'SET_ROLE_NAME'
export const EDIT_ROLE_SCREEN = 'SET_ROLE_SCREEN'
export const SET_NEW_ROLE = 'SET_NEW_ROLE'
export const SET_NEW_ROLE_NAME = 'SET_NEW_ROLE_NAME'
export const SET_NEW_ROLE_SCREEN = 'SET_NEW_ROLE_SCREEN'
export const SAVE_ROLE = 'SAVE_ROLE'

export const setInputRoles = options => dispatch => {
  dispatch({
    type: SET_INPUT_ROLES,
    payload: options,
  })
}

export const setInputScreens = options => dispatch => {
  dispatch({
    type: SET_INPUT_SCREENS,
    payload: options,
  })
}

export const setMaintainedRole = role => dispatch => {
  dispatch({
    type: SET_MAINTAINED_ROLE,
    payload: role,
  })
}

export const editRoleName = name => dispatch => {
  dispatch({
    type: EDIT_ROLE_NAME,
    payload: name,
  })
}

export const editRoleScreen = screens => dispatch => {
  dispatch({
    type: EDIT_ROLE_SCREEN,
    payload: screens,
  })
}

export const setNewRole = role => dispatch => {
  dispatch({
    type: SET_NEW_ROLE,
    payload: role,
  })
}

export const newRoleName = name => dispatch => {
  dispatch({
    type: SET_NEW_ROLE_NAME,
    payload: name,
  })
}

export const newRoleScreen = screens => dispatch => {
  dispatch({
    type: SET_NEW_ROLE_SCREEN,
    payload: screens,
  })
}
