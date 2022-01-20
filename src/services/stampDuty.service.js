export const stampDutyServices = {
  getstampDuty,
  getMonth,
  getLocationId,
}

function getstampDuty(data) {
  return fetch(
    process.env.REACT_APP_SERVER_URI +
      '/api/report/getStampDuty?location=' +
      data.location +
      '&monthYear=' +
      data.monthYear,
  ).then(handleResponse)
}
function getLocationId() {
  return fetch(process.env.REACT_APP_SERVER_URI + '/api/report/getAllLocationId').then(
    handleResponse,
  )
}

function getMonth() {
  return fetch(process.env.REACT_APP_SERVER_URI + '/api/report/getMonthYear').then(handleResponse)
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
