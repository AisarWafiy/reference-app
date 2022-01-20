export const assignSeaBinServices = {
  assignSeaBin,
}

function assignSeaBin(data) {
  const requestOptions = {
    method: 'POST',

    headers: { 'Content-Type': 'application/json' },
  }
  return fetch(
    process.env.REACT_APP_SERVER_URI +
      '/api/assignSeaBin/assignBin?truckNumber=' +
      data.truckNumber +
      '&seaBin=' +
      data.seaBin,
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
