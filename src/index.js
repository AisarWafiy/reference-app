import React from 'react'
import ReactDOM from 'react-dom'
import MainApp from 'MainApp'
import 'i18n'
import 'index.css'
import './css/react-notifications.css'
import feappver from 'utils/version'
import { LicenseManager } from '@ag-grid-enterprise/core'

console.log('REACT_APP_LOGIN ' + process.env.REACT_APP_LOGIN)
console.log('REACT_APP_SERVER_URI ' + process.env.REACT_APP_SERVER_URI)
console.log(feappver)

LicenseManager.setLicenseKey(process.env.REACT_APP_AG_GRID_KEY)
// todo React.StrictMode
ReactDOM.render(<MainApp />, document.getElementById('root'))
