import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'

import {
  setNotificationType,
  setActionType,
  setFlightAlerts,
  setRefundAlerts,
} from 'actions/action-dashboard'
import { alertActions } from 'actions/alert.actions'
import axios from 'axios'
import NotificationBar from '../NotificationPanel/NotificationBar/NotificationBar'

const NotificationPanel = props => {
  const { t } = useTranslation()
  const { flightChangeAlertCount, refundChangeAlertCount } = props

  const history = useHistory()
  // const redirect = async () => history.push('/notifications')

  // const handleFlightChange = () => {
  //   setNotificationType({ id: 1, name: 'Flight Change Alerts' })
  //   setActionType({ id: 2, name: 'N' })
  //   redirect()
  // }

  // const handleRefund = () => {
  //   setNotificationType({ id: 2, name: 'Refund Alerts' })
  //   setActionType({ id: 2, name: 'N' })
  //   redirect()
  // }

  return (
    <div className='row'>
      <div className='col-3'>
        <NotificationBar count={props.bellFLight} flightChange />
      </div>
      <div className='col-3'>
        <NotificationBar count={props.bellRefund} refund />
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  flightChangeAlertCount: state.dashboardReducer.flightChangeAlertCount,
  refundChangeAlertCount: state.dashboardReducer.refundChangeAlertCount,
  bellFLight: state.bellFLight,
  bellRefund: state.bellRefund,
})

const mapDispatchToProps = dispatch => ({
  // setNotificationType: data => dispatch(setNotificationType(data)),
  // setActionType: data => dispatch(setActionType(data)),
  // setFlightAlerts: data => dispatch(setFlightAlerts(data)),
  // setRefundAlerts: data => dispatch(setRefundAlerts(data)),
  // showAlertWarn: (message, status) => dispatch(alertActions.warning(message, status)),
  // showAlertSuccess: (message, status) => dispatch(alertActions.success(message, status)),
  // showAlertError: (message, status) => dispatch(alertActions.error(message, status)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NotificationPanel)
