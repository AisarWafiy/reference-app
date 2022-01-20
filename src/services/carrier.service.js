export const carrierServices = {
  getAllCarrier,
  getCarrierStatus,
  postCarrier,
  maintainCarrier,
  postFilterCarrier,
  updateSellOff,
}

function postFilterCarrier(data) {
  const requestOptions = {
    method: 'POST',

    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      departureFrom: data.departureFrom,
      departureTo: data.departureTo,
      carrierStatus: data.carrierStatus,
      carrierCodeNum: data.carrierCodeNum,
    }),
  }
  return fetch(process.env.REACT_APP_SERVER_URI + '/api/carrier/filter', requestOptions).then(
    handleResponse,
  )
}
function updateSellOff(data) {
  const requestOptions = {
    method: 'POST',

    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }
  return fetch(
    process.env.REACT_APP_SERVER_URI + '/api/carrier/updateSellingCutoff',
    requestOptions,
  ).then(handleResponse)
}
function getAllCarrier() {
  return fetch(process.env.REACT_APP_SERVER_URI + '/api/carrier/all').then(handleResponse)
}
function getCarrierStatus() {
  return fetch(process.env.REACT_APP_SERVER_URI + '/api/carrier/status').then(handleResponse)
}
function postCarrier(data) {
  const requestOptions = {
    method: 'POST',

    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      carrierType: data.carrierType,
      carrierFlag: data.carrierFlag,
      travelType: data.travelType,
      carrierRefMaster: data.carrierRefMaster,
      carrierRefCode: data.carrierRefCode,
      carrierNumber: data.carrierNumber,
      vesselName: data.vesselName,
      originAirportRefMaster: data.originAirportRefMaster,
      originAirportRefCode: data.originAirportRefCode,
      destAirportRefMaster: data.destAirportRefMaster,
      destAirportRefCode: data.destAirportRefCode,
      pickupLocationRefMaster: data.pickupLocationRefMaster,
      pickupLocationRefCode: data.pickupLocationRefCode,
      sellingCutoffTm: data.sellingCutoffTm,
      scheduleTimes: data.scheduleTimes,
      serviceFlag: true,
    }),
  }
  return fetch(process.env.REACT_APP_SERVER_URI + '/api/carrier/create', requestOptions).then(
    handleResponse,
  )
}

function maintainCarrier(data) {
  const requestOptions = {
    method: 'POST',

    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      carrierType: data.carrierType,
      id: data.id,
      carrierFlag: data.carrierFlag,
      travelType: data.travelType,
      carrierRefMaster: data.carrierRefMaster,
      carrierRefCode: data.carrierRefCode,
      carrierNumber: data.carrierNumber,
      vesselName: data.vesselName,
      originAirportRefMaster: data.originAirportRefMaster,
      originAirportRefCode: data.originAirportRefCode,
      destAirportRefMaster: data.destAirportRefMaster,
      destAirportRefCode: data.destAirportRefCode,
      pickupLocationRefMaster: data.pickupLocationRefMaster,
      pickupLocationRefCode: data.pickupLocationRefCode,
      sellingCutoffTm: data.sellingCutoffTm,
      scheduleTimes: data.scheduleTimes,
      serviceFlag: true,
      scheduleFlag: data.scheduleFlag,
      status: data.status,
    }),
  }
  return fetch(process.env.REACT_APP_SERVER_URI + '/api/carrier/maintain', requestOptions).then(
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
