export const bagsInPickupCounterReportServices = {
  getBagsInPickupCounterReport,
  getLocation,
}

function getBagsInPickupCounterReport(data) {
  return fetch(
    process.env.REACT_APP_SERVER_URI +
      '/api/report/getBagsInPickupCounter?location=' +
      data.locationId +
      '&flightDate=' +
      data.flightDate,
  ).then(handleResponse)
}
function getLocation(data) {
  return fetch(process.env.REACT_APP_SERVER_URI + '/api/report/getBagLocation').then(handleResponse)
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
