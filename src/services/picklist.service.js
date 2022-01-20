export const picklistServices = {
  getPicklist,
  // getDuplicate,
  printPicklist,
  getDrop,
}

function getPicklist(data) {
  return fetch(
    process.env.REACT_APP_SERVER_URI +
      '/api/picklist/view?pickupLocation=' +
      data.pickupLocation +
      '&departureDate=' +
      data.departureDate +
      '&shift=' +
      data.shift,
  ).then(handleResponse)
}
function printPicklist(data) {
  const requestOptions = {
    method: 'PUT',

    headers: { 'Content-Type': 'application/json' },
  }
  return fetch(
    process.env.REACT_APP_SERVER_URI +
      '/api/picklist/print?pickupLocation=' +
      data.pickupLocation +
      '&departureDate=' +
      data.departureDate +
      '&shift=' +
      data.shift,
    requestOptions,
  ).then(handleResponse)
}
function getDrop(data) {
  return fetch(process.env.REACT_APP_SERVER_URI + '/api/refdata/all').then(handleResponse)
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
