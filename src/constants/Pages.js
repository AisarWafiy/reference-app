export const ALERT_ERROR = 'ALERT_ERROR'
export const REFDATA = 'REFDATA'

const ListPages = [
  {
    page: 'REFDATA',
    path: process.env.REACT_APP_SERVER_URI + '/api/refdata/all',
    title: 'Master reference data',
  },
]

export const MapPages = new Map()

ListPages.map(obj => {
  MapPages.set(obj.page, obj)
  return 0
})
