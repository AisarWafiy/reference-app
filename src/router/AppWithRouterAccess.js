import React, { Fragment, useEffect } from 'react'

import { Route, useHistory, Switch } from 'react-router-dom'
import { Security, LoginCallback } from '@okta/okta-react'
import { OktaAuth } from '@okta/okta-auth-js'
import RenderComp from 'router/RenderComp'

import Login from 'components/Auth/Login'
import OktaConfig from 'components/Auth/OktaConfig'
import MaintenancePage from 'components/Pages/Maintenance/index'
import ErrorBoundary from 'components/Pages/ErrorBoundary/index'

import ErrorPage from 'components/Pages/ErrorBoundary/ErrorPage'

import PageNotifier from 'utils/notifier'
import { Redirect } from 'react-router-dom'
import { alertActions } from '../actions/alert.actions'
import { useDispatch } from 'react-redux'
import axios from 'axios'
const oktaAuth = new OktaAuth(OktaConfig.oidc)

const AppWithRouterAccess = () => {
  const history = useHistory()

  const dispatch = useDispatch()

  const customAuthHandler = () => {
    history.push('/login')
  }
  useEffect(() => {
    if (process.env.REACT_APP_LOGIN === 'OFF') {
      localStorage.removeItem('user')
      localStorage.removeItem('loginUserPermissionsData')
      const myemailid = 'bcconnect.saravan@dfs.com'
      axios
        .get(process.env.REACT_APP_SERVER_URI + '/api/user/info?userId=' + myemailid)
        .then(response => {
          const getData = response?.data?.result
          console.log('getData', getData)
          localStorage.setItem('user', myemailid)
          localStorage.setItem('loginUserPermissionsData', JSON.stringify(getData))
        })
        .catch(err => {
          if (err.response.data.error && !err.response.data.record)
            showAlertError(err.response.data.error, 'fetching Flight Change Alerts')
          else if (err.response.data.error && err.response.data.record)
            showAlertError(err.response.data.record, 'fetching Flight Change Alerts')
          else if (err.response.data.warning)
            dispatch(
              alertActions.warning(err.response.data.warning, 'fetching Flight Change Alerts'),
            )
          else dispatch(alertActions.error('Internal Server Error'))
        })
    }
  })
  return (
    <Security oktaAuth={oktaAuth} onAuthRequired={customAuthHandler}>
      <Fragment>
        <PageNotifier />
        <ErrorBoundary>
          <Switch>
            <RenderComp path='/home' tag='Home' />
            <RenderComp path='/customshome' tag='Dashboard' />
            <Route path='/login' render={() => <Login config={OktaConfig} />} />
            <Route path='/logout' render={() => <Redirect to={{ pathname: '/login' }} />} />
            <Route path='/implicit/callback' component={LoginCallback} />

            <Route path='/maintenance' component={MaintenancePage} />
            <Route path='/error' component={ErrorPage} />

            <RenderComp path='/user-no-screens' tag='UserNoScreens' />
            <RenderComp path='/notifications' tag='Notifications' />
            <RenderComp path='/administration/security/maintain-role' tag='MaintainRole' />
            <RenderComp path='/administration/security/create-role' tag='CreateRole' />
            <RenderComp
              path='/administration/security/maintain-reference-data'
              tag='MaintainReferenceData'
            />
            <RenderComp path='/administration/security/maintain-user' tag='MaintainUser' />
            <RenderComp path='/administration/Carrier/create-carrier' tag='CreateCarrier' />
            <RenderComp
              path='/customs/NACCS-Processing/NACCS-file-generation'
              tag='NACCSFileGeneration'
            />
            <RenderComp path='/customs/NACCS-Processing/NACCS-preview' tag='NACCSPreview' />
            {/* <RenderComp
              path='/customs/NACCS-Processing/NACCS-data-enquiry-report'
              tag='NACCSDataEnquiry'
            /> */}
            <RenderComp
              path='/customs/reports/NACCS-file-status-enquiry'
              tag='NACCSFileStatusEnquiry'
            />
            <RenderComp
              path='/customs/reports/NACCS-file-summary-enquiry'
              tag='NACCSFileSummaryEnquiry'
            />
            <RenderComp
              path='/customs/NACCS-Processing/maintain-bank-account'
              tag='MaintainBankAccount'
            />
            <RenderComp
              path='/customs/NACCS-Processing/maintain-and-merge-pax'
              tag='MaintainMergePax'
            />
            <RenderComp path='/customs/reports/stamp-duty-report' tag='StampDutyReport' />
            <RenderComp
              path='/customs/reports/bags-in-pickup-counter-report'
              tag='BagsInPickUpCounterReport'
            />
            <RenderComp
              path='/bag-tracking/reports/bag-tracking-enquiry'
              tag='BagTrackingEnquiry'
            />
            <RenderComp path='/bag-tracking/reports/bag-status-by-flight' tag='BagStatusByFlight' />
            <RenderComp
              path='/bag-tracking/reports/carton-tracking-enquiry'
              tag='CartonTrackingEnquiry'
            />
            <RenderComp
              path='/bag-tracking/reports/cage-tracking-enquiry'
              tag='CageTrackingEnquiry'
            />
            <RenderComp
              path='/bag-tracking/reports/bagtrax-daily-summary-report'
              tag='BagTraxDailySummaryReport'
            />
            <RenderComp
              path='/bag-tracking/reports/purchase-enquiry-by-pax'
              tag='PurchaseEnquiryBypax'
            />
            <RenderComp
              path='/bag-tracking/reports/bagtrax-delivery-report-by-trip'
              tag='BagTraxDeliveryReportByTrip'
            />
            <RenderComp
              path='/bag-tracking/reports/bag-by-bag-status-report'
              tag='BagByBagStatusReport'
            />
            <RenderComp
              path='/customs/reports/daily-NACCS-generation-list-report'
              tag='NACCSDailyGenListReport'
            />
            <RenderComp
              path='/customs/reports/Duty-Paid-Tobacco-Delivery-Report'
              tag='DPTobaccoDeliveryReport'
            />
            <RenderComp
              path='/customs/reports/Duty-Paid-Tobacco-Export-Report'
              tag='DPTobaccoExportReport'
            />
            <RenderComp
              path='/bag-tracking/administration/create-bin-location'
              tag='CreateBinLocation'
            />
            <RenderComp
              path='/bag-tracking/administration/maintain-bin-location'
              tag='MaintainBinLocation'
            />
            <RenderComp path='/administration/Carrier/maintain-carrier' tag='MaintainCarrier' />
            <RenderComp path='/bag-tracking/administration/create-cage' tag='CreateCage' />
            <RenderComp path='/bag-tracking/administration/maintain-cage' tag='MaintainCage' />
            <RenderComp path='/bag-tracking/administration/create-truck' tag='CreateTruck' />
            <RenderComp path='/bag-tracking/administration/maintain-truck' tag='MaintainTruck' />
            <RenderComp path='/bag-tracking/administration/assign-sea-bin' tag='AssignSeaBin' />
            <RenderComp path='/bag-tracking/administration/release-bags' tag='ReleaseBags' />
            <RenderComp
              path='/bag-tracking/administration/airport-override-bagtracking'
              tag='AirportOverrideBagtracking'
            />
            <RenderComp
              path='/bag-tracking/administration/warehouse-override-bagtracking'
              tag='WarehouseOverrideBagtracking'
            />
            <RenderComp
              path='/bag-tracking/administration/delivery-manifest'
              tag='DeliveryManifest'
            />
            <RenderComp
              path='/bag-tracking/administration/picklist-generation'
              tag='PickListGeneration'
            />
            <RenderComp
              path='/bag-tracking/reports/bag-tracking-reports'
              tag='BagTrackingReports'
            />
            <RenderComp
              path='/bag-tracking/reports/pax-flight-change-notification'
              tag='PAXFlightChangeNotification'
            />
            <RenderComp
              path='/bag-tracking/reports/customer-refund-notification'
              tag='CustomerRefundNotification'
            />
            <RenderComp path='/bag-tracking/reports/item-enquiry' tag='ItemEnquiry' />
            <Route path='/' render={() => <Login config={OktaConfig} />} />
          </Switch>
        </ErrorBoundary>
      </Fragment>
    </Security>
  )
}
export default AppWithRouterAccess
