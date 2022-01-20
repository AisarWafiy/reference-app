export const maintainReferenceDataServices = {
  getRefAll,
  postRef,
  getMasterRef,
  getRef,
}

function getRef(data) {
  return fetch(process.env.REACT_APP_SERVER_URI + '/api/refdata/list/' + data).then(handleResponse)
}

function getRefAll(data) {
  return fetch(process.env.REACT_APP_SERVER_URI + '/api/refdata/all').then(handleResponse)
}

function getMasterRef() {
  return fetch(process.env.REACT_APP_SERVER_URI + '/api/refmaster/all').then(handleResponse)
}
function postRef(data) {
  const requestOptions = {
    method: 'POST',

    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      refId: data.refId,

      refMaster: data.refMaster,
      refCode: data.refCode,
      refValue: data.refValue,
      naccsCode: data.naccsCode,
      tmTo: data.tmTo,
      tmFrom: data.tmFrom,
      refFlag: data.refFlag,
    }),
  }
  return fetch(process.env.REACT_APP_SERVER_URI + '/api/refdata/save', requestOptions).then(
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
