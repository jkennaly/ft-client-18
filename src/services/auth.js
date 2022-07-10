// auth.js

import AuthLocal from '@0441design/auth-fg-browser'
import authwrapper from './authwrapper'

const AUTH_DATA = typeof AUTH_CONFIG === 'undefined' ? {} : AUTH_CONFIG
const apiUrl = API_URL || 'https://api.festigram.app'
//const AuthClass = AUTH_DATA.SCHEME === 'local' ? new AuthLocal() : new Auth0()
const AuthClass = new AuthLocal(AUTH_DATA, apiUrl)

export default AuthClass

export { authwrapper }