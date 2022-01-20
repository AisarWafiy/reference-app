export const bagStatusFlightServices = {
  getBagStatusFlight,
  getCarrierCode,
}

function getBagStatusFlight(data) {
  return fetch(
    process.env.REACT_APP_SERVER_URI +
      '/api/report/getBagStatusByFlight?carrierCode=' +
      data.carrierCode +
      '&carrierDepStartDate=' +
      data.carrierDepStartDate +
      '&carrierDepEndDate=' +
      data.carrierDepEndDate,
  ).then(handleResponse)
}
function getCarrierCode(data) {
  return fetch(process.env.REACT_APP_SERVER_URI + '/api/carrier/carriercode').then(handleResponse)
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
