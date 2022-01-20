export const cageServices = {
  postCage,
  updateCage,
  getAllCage,
  getCage,
  deleteCage,
}

function postCage(data) {
  const requestOptions = {
    method: 'POST',

    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cageNumber: data.cageNumber,
      maxNumCartons: data.maxNumCartons,
      cageRemarks: data.cageRemarks,
      cageDesc: data.cageDesc,
    }),
  }
  return fetch(process.env.REACT_APP_SERVER_URI + '/api/cage/createCage', requestOptions).then(
    handleResponse,
  )
}
function updateCage(data) {
  const requestOptions = {
    method: 'POST',

    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cageNumber: data.cageNumber,
      maxNumCartons: data.maxNumCartons,
      cageRemarks: data.cageRemarks,
      cageDesc: data.cageDesc,
    }),
  }
  return fetch(process.env.REACT_APP_SERVER_URI + '/api/cage/updateCage', requestOptions).then(
    handleResponse,
  )
}

function getAllCage() {
  return fetch(process.env.REACT_APP_SERVER_URI + '/api/cage/getAllCage').then(handleResponse)
}
function getCage(data) {
  return fetch(process.env.REACT_APP_SERVER_URI + '/api/cage/getCage/' + data).then(handleResponse)
}
function deleteCage(data) {
  const cageNum = data
  const requestOptions = {
    method: 'Post',
    headers: { 'Content-Type': 'application/json' },
  }
  return fetch(
    process.env.REACT_APP_SERVER_URI + '/api/cage/deleteCage/' + cageNum,
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
