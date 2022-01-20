import {
  SET_INPUT_ROLES,
  SET_INPUT_SCREENS,
  SET_MAINTAINED_ROLE,
  EDIT_ROLE_NAME,
  EDIT_ROLE_SCREEN,
} from 'actions/action-roles'

const initialState = {
  maintainedRole: {
    role: { roleId: '', roleName: '' },
    pagePer: [],
  },

  roles: [],
  pagePer: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_INPUT_ROLES:
      return {
        ...state,
        roles: action.payload.roles,
      }

    case SET_INPUT_SCREENS:
      return {
        ...state,
        pagePer: action.payload.pagePer,
      }

    case EDIT_ROLE_NAME:
      return {
        ...state,
        maintainedRole: {
          ...state.maintainedRole,
          role: {
            ...state.maintainedRole.role,
            roleName: action.payload,
          },
        },
      }

    case EDIT_ROLE_SCREEN:
      return {
        ...state,
        maintainedRole: {
          ...state.maintainedRole,
          pagePer: action.payload,
        },
      }

    case SET_MAINTAINED_ROLE:
      return {
        ...state,
        maintainedRole: action.payload,
      }

    default:
      return state
  }
}
