export const cartonTrackingEnquiryServices = {
  getCartonTrackingEnquiry,
  getCartonNumber,
}

function getCartonTrackingEnquiry(data) {
  return fetch(
    process.env.REACT_APP_SERVER_URI + '/api/report/getCartonTrackingReport?cartonNumber=' + data,
  ).then(handleResponse)
}
function getCartonNumber(data) {
  return fetch(process.env.REACT_APP_SERVER_URI + '/api/report/getCartonId').then(handleResponse)
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
