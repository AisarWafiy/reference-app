export const bagByBagStatusReportServices = {
  getBagByBagStatusReport,
  getBagStatus,
}

function getBagByBagStatusReport(data) {
  const requestOptions = {
    method: 'POST',

    headers: { 'Content-Type': 'application/json' },
  }
  return fetch(
    process.env.REACT_APP_SERVER_URI +
      '/api/report/getBagByBagStatusReport?carrierDepStartDate=' +
      data.startDate +
      '&carrierDepEndDate=' +
      data.endDate +
      '&bagStatus=' +
      data.bagStatus,
    requestOptions,
  ).then(handleResponse)
}
function getBagStatus(data) {
  return fetch(process.env.REACT_APP_SERVER_URI + '/api/report/getAllBagEntityStatus').then(
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
