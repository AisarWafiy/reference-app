export const dpTobaccoReportServices = {
  getDPTobaccoDeliveryReport,
  getDPTobaccoExportReport,
}

function getDPTobaccoDeliveryReport(data) {
  return fetch(
    process.env.REACT_APP_SERVER_URI +
      '/api/report/dutyPaidTobaccoDelivery?departureDateFrom=' +
      data.dateFrom +
      '&departureDateTo=' +
      data.dateTo,
  ).then(handleResponse)
}

function getDPTobaccoExportReport(data) {
  const requestOptions = {
    method: 'POST',

    headers: { 'Content-Type': 'application/json' },
  }
  return fetch(
    process.env.REACT_APP_SERVER_URI +
      '/api/report/dutyPaidTobaccoExport?departureDateFromStr=' +
      data.dateFrom +
      '&departureDateToStr=' +
      data.dateTo,
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
