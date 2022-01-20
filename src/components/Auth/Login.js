import React from 'react'
import { Redirect } from 'react-router-dom'
import OktaSignInWidget from './OktaSignInWidget'
import { useOktaAuth } from '@okta/okta-react'
import { useDispatch } from 'react-redux'
import { loginResponse } from 'services/login.service'

const Login = ({ config }) => {
  const { oktaAuth, authState } = useOktaAuth()
  const dispatch = useDispatch()

  const onSuccess = tokens => {
    console.log('login success')
    oktaAuth.handleLoginRedirect(tokens)
  }

  const onError = err => {
    console.log('error logging in', err)
  }

  if (authState.isPending) {
    console.log('pending')
    return null
  }

  if (authState.isAuthenticated) {
    localStorage.removeItem('user')
    localStorage.removeItem('loginUserPermissionsData')
    oktaAuth.getUser().then(info => {
      let userId = info.email
      if (userId) {
        localStorage.setItem('user', userId)
        loginResponse(userId, dispatch, oktaAuth)
      }

    })
  }

  // TODO
  // async checkAuthentication() {
  //   const authenticated = await this.props.authState.isAuthenticated;
  //   if (authenticated !== this.state.authenticated) {
  //     this.setState({ authenticated });
  //   }
  // }
  // onSuccess = res => {
  //   localStorage.removeItem("auth_token");
  //   localStorage.removeItem("user");
  //   return this.props.authService.redirect({
  //     sessionToken: res.session.token
  //   });
  // };

  // onError = err => {
  //   console.log('error logging in', err);
  // };

  if (process.env.REACT_APP_LOGIN === 'OFF') {
    return <Redirect to={{ pathname: '/home' }} />
  }

  return authState.isAuthenticated ? (
    <Redirect to={{ pathname: '/home' }} />
  ) : (
    <div style={{ padding: '2rem', height: '40%' }}>
      <OktaSignInWidget config={config} onSuccess={onSuccess} onError={onError} />
    </div>
  )
}
export default Login
