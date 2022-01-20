export const overrideBagtrackingServices = {
  bagtrackAirport,
  bagtrackWarehouse,
}

function bagtrackWarehouse(data) {
  const requestOptions = {
    method: 'POST',

    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bagNumber: data.bagNumber,
      truckNumber: data.truckNumber,
      truckDeparted: data.truckDeparted,
    }),
  }
  return fetch(
    process.env.REACT_APP_SERVER_URI + '/api/bagtrack/override/warehouse',
    requestOptions,
  ).then(handleResponse)
}

function bagtrackAirport(data) {
  const requestOptions = {
    method: 'POST',

    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bagNumber: data.bagNumber,
      binLocation: data.binLocation,
    }),
  }
  return fetch(
    process.env.REACT_APP_SERVER_URI + '/api/bagtrack/override/airport',
    requestOptions,
  ).then(handleResponse)
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
