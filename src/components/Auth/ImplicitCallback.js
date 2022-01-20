import React from 'react'
import { LoginCallback } from '@okta/okta-react'
import UnAuthorized from 'components/Pages/UnAuthorized/index'
const ImplicitCallback = () => <LoginCallback errorComponent={UnAuthorized} />

export default ImplicitCallback
