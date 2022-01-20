import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import { Redirect } from 'react-router-dom'
import i18next from 'i18next'
class PageNotifier extends Component {
  constructor(props) {
    super(props)
    this.state = {
      alertMe: {},
    }
    this.ref = React.createRef()
  }

  createNotification = alertMe => {
    switch (alertMe.type) {
      case 'info':
        NotificationManager.info(alertMe.message)
        break
      case 'success':
        console.log('Success Message : ', alertMe.message)
        NotificationManager.success('', i18next.t(alertMe.message.substring(0, 300)), 7000)
        break
      case 'warning':
        console.log('Warning Message : ', alertMe.message)
        NotificationManager.warning(
          '',
          alertMe.message.length > 300
            ? i18next.t('System Error. Please contact IT support team')
            : i18next.t(alertMe.message),
          7000,
        )
        break
      case 'error':
        console.log('Error Message : ', alertMe.message)

        NotificationManager.error(
          '',
          alertMe.message.length > 300
            ? i18next.t('System Error. Please contact IT support team')
            : i18next.t(alertMe.message),
          7000,
          () => {},
        )
        break
      default:
        break
    }
  }
  // static getDerivedStateFromProps(props, state) {
  //   if (props.alertMe !== state.alertMe && props.alertMe.alertFor === 'chgPwd') {
  //     return {
  //       alertMe: props.alertMe,
  //     }
  //   } else return null
  // }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let notification = this.ref.current.state.notifications.filter(n => {
      return nextProps.alertMe.message === n.title
    })
    if (!notification.length) {
      this.setState({
        alertMe: nextProps.alertMe,
      })
      this.createNotification(nextProps.alertMe)
    }
  }

  render() {
    const { alertMe } = this.state
    if (alertMe && alertMe.message && alertMe.message.includes('token is expired')) {
      return <Redirect to={'/login'} />
    } else
      return (
        <div>
          <NotificationContainer ref={this.ref} />
        </div>
      )
  }
}

const mapStateToProps = state => ({
  alertMe: state.notification.alertMe,
})

export default connect(mapStateToProps)(PageNotifier)
