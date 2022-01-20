export const releaseBagsServices = {
  getBags,
  // getDuplicate,
  releaseBags,
}

function getBags(data) {
  return fetch(
    process.env.REACT_APP_SERVER_URI + '/api/bag/releaseLookup?paxNumber=' + data.paxNumber,
  ).then(handleResponse)
}
function releaseBags(data) {
  const requestOptions = {
    method: 'PUT',

    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bagNo: data.bagNo,
      cartonNumber: data.cartonNumber,
      cageNumber: data.cageNumber,
      bagStatus: data.bagStatus,
      carrierNumber: data.carrierNumber,
      carrierDate: data.carrierDate,
    }),
  }
  return fetch(process.env.REACT_APP_SERVER_URI + '/api/bag/release', requestOptions).then(
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
