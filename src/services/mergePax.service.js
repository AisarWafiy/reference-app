export const mergePaxServices = {
  getPax,
  // getDuplicate,
  mergePax,
  getCarr,
}

function getPax(data) {
  return fetch(
    process.env.REACT_APP_SERVER_URI +
      '/api/pax/getDuplicate?carrierCode=' +
      data.carrierCode +
      '&departureDate=' +
      data.departureDate,
  ).then(handleResponse)
}

function getCarr() {
  return fetch(process.env.REACT_APP_SERVER_URI + '/api/carrier/carriercode').then(handleResponse)
}
function mergePax(data) {
  const requestOptions = {
    method: 'POST',

    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }
  return fetch(process.env.REACT_APP_SERVER_URI + '/api/pax/mergePax', requestOptions).then(
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
