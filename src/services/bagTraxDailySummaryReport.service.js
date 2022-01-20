export const bagTraxDailySummaryReportServices = {
  getBagTraxDailySummaryReport,
}

function getBagTraxDailySummaryReport(data) {
  return fetch(
    process.env.REACT_APP_SERVER_URI +
      '/api/report/getBagTraxDailySummaryReport?transferDate=' +
      data.transferDate +
      '&internationalFlag=' +
      data.internationalFlag +
      '&preOrderFlag=' +
      data.preOrderFlag,
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
