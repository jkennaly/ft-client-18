// auth.js

import auth00 from 'auth0-js';
import AUTH0_DATA from './auth0-variables';
import m from 'mithril'
import localforage from 'localforage'
import emptyPromise from 'empty-promise'
const Promise = require('promise-polyfill').default
//import {tokenFunction} from './requests'

const scopeAr = 'openid profile email admin create:messages verify:festivals create:festivals'

const setSession = function(authResult) {
  // Set the time that the Access Token will expire at
  let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
  localStorage.setItem('access_token', authResult.accessToken);
  localStorage.setItem('id_token', authResult.idToken);
  localStorage.setItem('expires_at', expiresAt);
  // navigate to the home route if current route matches
  const goHome = /auth/
  const currentRoute = m.route.get()
  if(goHome.test(currentRoute)) m.route.set('/launcher');
}
  
const tokenFunction = function(xhr) {
  xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
}


const userIdFromToken = idToken => m.request({
  method: "GET",
  url: "/api/Profiles/getUserId",
  config: tokenFunction,
  data: {
    idToken: idToken
  }
})
.then(result => {
  const id = result.id
  if(!id) throw 'invalid id received from getFtUserId() ' + id
  return id
})

var userIdPromiseCache = emptyPromise()
var idRequestInProgress = 0
let accessTokenPromiseCache = {}
var accessTokenPending = false
var userIdCache = 0

export default class Auth {
  auth0 = new auth00.WebAuth({
    domain: AUTH0_DATA.DOMAIN,
    clientID: AUTH0_DATA.CLIENTID,
    redirectUri: AUTH0_DATA.CALLBACKURL,
    audience: AUTH0_DATA.AUDIENCE,
    responseType: 'token id_token',
    scope: scopeAr
  });

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      //console.log(window.location)
      //console.log(window.location.hash)
      //console.log('handleAuthentication')
      //console.log(authResult)
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        //this.getFtUserId();
        //m.route.set('/launcher');
      } else if (err) {
        console.log(err)
        m.route.set('/auth')
      } else {
        const tokenValid = this.isAuthenticated()
        //console.log('tokenValid ' + tokenValid)
        this.getFtUserId('handleAuthentication')
          .catch(console.error)
      }
    });
  }

  setSession = setSession

  userId() {
    //console.log('auth userId')
    //console.log(userIdCache)
    return userIdCache
  }

  //returns a promise that resolves to a userIdCache
  getFtUserId(requester) {
    //console.log('userIdCache requested by ' + requester)
    const onAuthRoute = /auth/.test(window.location)
    if(onAuthRoute) return Promise.resolve(0)
    //find if there is a last token and if it's still good
    const tokenValid = this.isAuthenticated()
    //if it is, get the local userId
    if(tokenValid) {
      const localUser = parseInt(localStorage.getItem('ft_user_id'), 10)
      if(localUser) userIdCache = localUser
    }
    if(tokenValid && userIdCache) return Promise.resolve(userIdCache)
    
    //if it's not, check idRequestInProgress to stop multiple requests
    //const now = Date.now()
    
    if(!idRequestInProgress) {
      //console.log('idRequestInProgress begins')
      idRequestInProgress = true
      //if there is no token or its expired and there is no request already, start one
      const idTokenLocal = tokenValid && localStorage.getItem('id_token')

      userIdPromiseCache.resolve(
        (idTokenLocal ? new Promise.resolve(idTokenLocal) : this.getAccessToken())
          //.then(idToken => [console.log('userIdPromiseCache idToken', idToken), idToken][1])
          .then(userIdFromToken)
          //.then(userId => [console.log('userIdPromiseCache userId', userId), userId][1])
          .then(id => {
            userIdCache = id
            localStorage.setItem('ft_user_id', id)
            idRequestInProgress = false
            return id
          })
          .catch(err => {
            idRequestInProgress = false
            console.error('userIdPromiseCache failed', err)
          })
      )
      return userIdPromiseCache

    }
    //console.log('idRequestInProgress')
    //if there is a idRequestInProgress, return a promise the promiseCache will resolve
    
    //return new Promise(resolve => setTimeout(resolve, 5000, userIdPromiseCache))
    return userIdPromiseCache
    
    
  }

  logout(skipRoute) {
    const loggingIn = /access_token/.test(window.location)
    if(loggingIn) return
    // Clear Access Token and ID Token from local storage
    localStorage.clear()
    localforage.clear()
    userIdCache = 0
    // navigate to the default route
    if(!skipRoute) m.route.set('/auth')
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // Access Token's expiry time
    //returns the token if it is valid
    const currentToken = localStorage.getItem('access_token')
    let expiresAt = currentToken && JSON.parse(localStorage.getItem('expires_at'));
    const timeOk = currentToken && new Date().getTime() < expiresAt
    //console.log('auth isAuthenticated ' + timeOk + ' expires ' + (new Date(expiresAt)).toLocaleTimeString())
    return timeOk && currentToken && true || false
  }

  getAccessToken() {
    //this returns a promise that resolves to a valid token
    //setSession is required if:
      //token cannot be authenticated AND
      //no pending reuest for authentication
    //cachedValue is good if:
      //token is authentic OR
      //request is pending
    //console.log('getAccessToken')
    //console.log(accessTokenPending)
    //tokenValid is falsey if not authenticated, and the token value if authenticated
    const tokenValid = this.isAuthenticated()
    const promiseCacheValid = accessTokenPromiseCache && accessTokenPromiseCache.then
    const useCache = promiseCacheValid && (accessTokenPending || tokenValid)
    if(useCache) return accessTokenPromiseCache

    //if the tokenValid, set that to the cache and return it
    if(tokenValid) {
      //console.log('found old valid token')
      const promise = Promise.resolve(localStorage.getItem('access_token'))
      accessTokenPromiseCache = promise
      return promise
    }
    
    //console.log('new getAccessToken request')
    var _this = this
    var promise = new Promise((resolve, reject) => _this.auth0.checkSession({},
        function(err, result) {
          accessTokenPending = false
          //console.log('checkSession err & result')
          //console.log(err)
          //console.log(result)
          if (err) {
            reject(err);
          } else {
            setSession(result)
            resolve(result.accessToken)
          }
        }
    ))
    accessTokenPromiseCache = promise
    accessTokenPending = true
    return promise
  }
}