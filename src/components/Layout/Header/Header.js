import React, { useEffect, useState } from 'react'
import BreadCrumb from '../BreadCrumb/BreadCrumb'
import NotificationBell from 'components/Layout/NotificationBell/NotificationBell'
import Logo from '../../../assets/images/dfs-logo.png'
import { BiUserCircle } from 'react-icons/bi'
import { IoLanguageOutline } from 'react-icons/io5'
import { AiOutlineClockCircle } from 'react-icons/ai'
import { useOktaAuth } from '@okta/okta-react'
import { calcTime } from 'constants/dateTime'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { bellActions } from 'actions/bell.actions'
import { setFlightAlerts, setRefundAlerts, setBellCount } from 'actions/action-dashboard'
import { alertActions } from 'actions/alert.actions'
import NACCSAutoDecleration from '../NACCSAutoDecleration/NACCSAutoDecleration'
let interval
let interval1
let interval2
const Header = props => {
  const { t, i18n } = useTranslation()
  const { oktaAuth, authState } = useOktaAuth()
  const [loginUserData, setloginUserData] = useState()

  const logout = async () => {
    localStorage.removeItem('user')
    localStorage.removeItem('loginUserPermissionsData')
    oktaAuth.signOut()
  }
  const history = useHistory()

  const {
    path,
    flightChangeAlertCount,
    refundChangeAlertCount,
    setFlightAlerts,
    setRefundAlerts,
    showAlertError,
    setBellCount,
    bellCount,
  } = props

  let logoutButton = null

  if (authState.isAuthenticated) {
    logoutButton = (
      <button onClick={logout} className='btn btn-outline-primary btn-sm'>
        Logout
      </button>
    )
  }

  const currentTime = () => {
    document.getElementById('time').innerHTML = calcTime('+9')
  }
  const notifications = () => {
    axios
      .get(process.env.REACT_APP_SERVER_URI + '/api/countFlightChangeAlerts')
      .then(response => {
        const getData = response.data.result
        setFlightAlerts(getData)
        props.setBellFlight(getData)
      })
      .catch(err => {
        if (err.response.data.error === 'E-0220') {
          props.setBellFlight(0)
        } else {
          props.setBellFlight(0)
        }
      })

    axios
      .get(process.env.REACT_APP_SERVER_URI + '/api/countRefundAlerts')
      .then(response => {
        const getData = response.data.result
        setRefundAlerts(getData)
        props.setBellRefund(getData)
      })
      .catch(err => {
        if (err.response.data.error === 'E-0219') {
          props.setBellRefund(0)
        } else {
          props.setBellRefund(0)
        }
      })
  }
  useEffect(() => {
    // if (document.getElementById('time'))
    interval1 = setInterval(currentTime, 1000)
    interval2 = setInterval(notifications, 300000)
    notifications()
    return () => clearInterval(interval1)
    return () => clearInterval(interval2)
  }, [])

  useEffect(() => {
    setBellCount(flightChangeAlertCount + refundChangeAlertCount)
  }, [flightChangeAlertCount, refundChangeAlertCount])

  useEffect(() => {
    if (!loginUserData) {
      interval = setInterval(() => {
        let loginUserData = JSON.parse(localStorage.getItem('loginUserPermissionsData'))
        setloginUserData(loginUserData)
      }, 10)
    }
    return () => clearInterval(interval)
  }, [loginUserData])

  const changeLanguage = lang => {
    return () => {
      i18n.changeLanguage(lang)
      console.log('language Changed TO ', lang)
    }
  }

  const handleNotificationClick = () => {
    history.push('/notifications')
  }
  let NACCSAutoDeclerationAccess = loginUserData?.rolePerData?.pagePer?.findIndex(
    y => y.permissionName === 'NACCS Auto Generation',
  )
  let NotificationAccess = loginUserData?.rolePerData?.pagePer?.findIndex(
    y => y.permissionName === 'Notifications',
  )

  return (
    <div style={{ width: '100%', margin: 0, padding: 0 }}>
      <div className='container-fluid' style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div className='row' style={{ width: '100%', paddingLeft: 0, paddingRight: 0 }}>
          <div className='col-sm-2' style={{ paddingRight: 0 }}>
            <img src={Logo} className='logo' alt='DFS Logo' />
          </div>
          <div
            className='col-sm-10 '
            style={{
              paddingLeft: 0,
              paddingRight: 0,
            }}
          >
            <div
              className='row'
              style={{
                paddingLeft: 0,
                paddingRight: 0,
                margin: 0,
                height: '100%',
              }}
            >
              <div
                className={
                  (
                    NACCSAutoDeclerationAccess === 0
                      ? true
                      : NACCSAutoDeclerationAccess && NACCSAutoDeclerationAccess != -1
                  )
                    ? 'col-sm-3  header-text border-right'
                    : 'col-sm-3 header-text border-right'
                }
              >
                <AiOutlineClockCircle /> &nbsp;
                <span className='header-title'>
                  <span id='time' />
                  {' (JST)'}
                </span>
              </div>

              <div
                className={
                  (
                    NACCSAutoDeclerationAccess === 0
                      ? true
                      : NACCSAutoDeclerationAccess && NACCSAutoDeclerationAccess != -1
                  )
                    ? 'col-sm-2  header-text border-right'
                    : 'col-sm-2  header-text border-right'
                }
              >
                <button
                  style={{ border: 'none', backgroundColor: 'white' }}
                  onClick={changeLanguage('japn')}
                  className='header-title'
                >
                  {' '}
                  日本語
                </button>{' '}
                <button
                  style={{ border: 'none', backgroundColor: 'white' }}
                  onClick={changeLanguage('en')}
                  className='header-title'
                >
                  English
                </button>
              </div>
              {(NACCSAutoDeclerationAccess === 0
                ? true
                : NACCSAutoDeclerationAccess && NACCSAutoDeclerationAccess != -1) && (
                <div className='col-sm-3 text-center  border-right'>
                  <NACCSAutoDecleration />
                </div>
              )}
              {loginUserData && loginUserData.user && (
                <div
                  className={
                    (
                      NACCSAutoDeclerationAccess === 0
                        ? true
                        : NACCSAutoDeclerationAccess && NACCSAutoDeclerationAccess != -1
                    )
                      ? 'col-sm-2  header-text border-right'
                      : 'col-sm-2  header-text border-right'
                  }
                >
                  <BiUserCircle /> &nbsp;
                  <span className='header-title'>{loginUserData.user.firstName}</span>
                </div>
              )}

              {(NotificationAccess === 0
                ? true
                : NotificationAccess && NotificationAccess != -1) && (
                <div className='col-sm-1 pt-2'>
                  <NotificationBell
                    onClick={handleNotificationClick}
                    count={props.bellRefund + props.bellFLight}
                  />
                </div>
              )}
              <div className='col-sm-1  header-text'>{logoutButton}</div>
            </div>
          </div>
        </div>
        <div className='row' style={{ width: '100%', paddingLeft: 0, paddingRight: 0 }}>
          <div className='col' style={{ paddingLeft: 0, paddingRight: 0 }}>
            <BreadCrumb path={path} />
          </div>
        </div>
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
  setFlightAlerts: data => dispatch(setFlightAlerts(data)),
  setRefundAlerts: data => dispatch(setRefundAlerts(data)),
  setBellCount: () => dispatch(setBellCount()),
  setBellFlight: data => dispatch(bellActions.bellFLight(data)),
  setBellRefund: data => dispatch(bellActions.bellRefund(data)),
  showAlertError: (message, status) => dispatch(alertActions.error(message, status)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
