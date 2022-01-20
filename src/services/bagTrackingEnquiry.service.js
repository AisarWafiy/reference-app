export const bagTrackingEnquiryServices = {
  getBagTrackingEnquiry,
}

function getBagTrackingEnquiry(data) {
  return fetch(
    process.env.REACT_APP_SERVER_URI + '/api/report/getBagTrackingEnquiryReport?bagNumber=' + data,
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
