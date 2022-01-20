export const truckNumberServices = {
  getTruckNumber,
  getSeaBinTruck,
}

function getTruckNumber(data) {
  return fetch(process.env.REACT_APP_SERVER_URI + '/api/truck/getAllTruck').then(handleResponse)
}
function getSeaBinTruck(data) {
  return fetch(process.env.REACT_APP_SERVER_URI + '/api/assignSeaBin/getAllActiveTrucks').then(
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
