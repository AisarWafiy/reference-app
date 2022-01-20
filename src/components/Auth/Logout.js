import React from 'react'
import { useHistory } from 'react-router-dom'
import { useOktaAuth } from '@okta/okta-react'

const Logout = () => {
  const history = useHistory()
  const { oktaAuth, authState } = useOktaAuth()

  if (authState.isPending) return null

  const login = async () => history.push('/login')

  const logout = async () => oktaAuth.signOut()

  const button = async () =>
    authState.isAuthenticated ? (
      <button onClick={logout} className='btn btn-primary'>
        Logout
      </button>
    ) : (
      <button onClick={login}>Login</button>
    )

  return <div>{button}</div>
}
export default Logout
