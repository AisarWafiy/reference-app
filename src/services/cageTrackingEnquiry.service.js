export const cageTrackingEnquiryServices = {
  getCageTrackingEnquiry,
}

function getCageTrackingEnquiry(data) {
  return fetch(
    process.env.REACT_APP_SERVER_URI + '/api/report/getCageTrackingReport?cageNumber=' + data,
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
