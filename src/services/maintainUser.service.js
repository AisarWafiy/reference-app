export const maintainUserDataServices = {
  getUser,
  postUser,
  getRole,
}

function getUser() {
  return fetch(process.env.REACT_APP_SERVER_URI + '/api/user/users').then(handleResponse)
}
function getRole() {
  return fetch(process.env.REACT_APP_SERVER_URI + '/api/user/roles').then(handleResponse)
}
function postUser(data) {
  const requestOptions = {
    method: 'POST',

    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: data.userId,
      roleId: data.roleId,
      roleName: data.roleName,
      firstName: data.firstName,
      lastName: data.lastName,
      employeeId: data.employeeId,
      lastLoggedIn: data.lastLoggedIn,
      active: data.active,
    }),
  }
  return fetch(process.env.REACT_APP_SERVER_URI + '/api/user/edituser', requestOptions).then(
    handleResponse,
  )
}

function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text)
    if (!response.ok) {
      return Promise.reject(data)
    }

    return data
  })
}
