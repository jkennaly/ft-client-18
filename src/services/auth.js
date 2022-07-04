// auth.js

//import Auth0 from './authOptions/auth0'
//import AuthNoToken from './authOptions/authNoToken'
import AuthLocal from './authOptions/authLocal'
import authwrapper from './authwrapper'

const AUTH_DATA = typeof AUTH_CONFIG === 'undefined' ? {} : AUTH_CONFIG

//const AuthClass = AUTH_DATA.SCHEME === 'local' ? new AuthLocal() : new Auth0()
const AuthClass = new AuthLocal()

export default AuthClass

export { authwrapper }