const CLIENT_ID = process.env.REACT_APP_CLIENT_ID
const BASEURL = process.env.REACT_APP_BASEURL
const DOMAIN = process.env.REACT_APP_DOMAIN

const ISSUER = BASEURL
const REDIRECTURI = DOMAIN + '/implicit/callback'
const OKTA_TESTING_DISABLEHTTPSCHECK = process.env.OKTA_TESTING_DISABLEHTTPSCHECK || false

// TODO comment these
console.log('ISSUER ' + ISSUER)
console.log('BASEURL ' + BASEURL)
console.log('CLIENT_ID ' + CLIENT_ID)
console.log('DOMAIN ' + DOMAIN)
console.log('REDIRECTURI ' + REDIRECTURI)

const OktaConfig = {
  oidc: {
    baseUrl: BASEURL,
    clientId: CLIENT_ID,
    issuer: ISSUER,
    redirectUri: REDIRECTURI,
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: OKTA_TESTING_DISABLEHTTPSCHECK,
    authParams: {
      issuer: ISSUER,
      scopes: ['openid', 'profile', 'email'],
    },
    i18n: {
      en: {
        'errors.E0000004': 'Invalid User Id / Password (or) User is not added in OKTA system for BCConnect application. Please contact admin to add your user Id'
      },
    },
  },
}

export default OktaConfig
