// auth.js

import auth00 from 'auth0-js';
import AUTH0_DATA from './auth0-variables';
import m from 'mithril'
import localforage from 'localforage'
const Promise = require('promise-polyfill').default

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

var userIdPromiseCache = {}
var idRequestInProgress = 0
var accessTokenPromiseCache = {}
var accessTokenPending = false
var memId = 0

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
        console.log(err);
        m.route.set('/auth');
      }
    });
  }

  setSession = setSession


  getFtUserId(requester) {
    //console.log('userId requested by ' + requester)
    if(m.route.get().indexOf('auth') > -1) return Promise.reject(false)
    //find if there is a last token and if it's still good
    const tokenValid = this.isAuthenticated()
    //if it is, return 
    if(tokenValid && userIdPromiseCache.then) return userIdPromiseCache
    //if it's not, check idRequestInProgress to stop multiple requests
    //const now = Date.now()
    if(!idRequestInProgress) {
    //console.log('!idRequestInProgress')
      idRequestInProgress = true
      //if there is no token or its expired and there is no request already, start one
      const idToken = localStorage.getItem('id_token')
      if(!idToken) return Promise.reject(this.logout())
      userIdPromiseCache = m.request({
        method: "GET",
        url: "/api/Profiles/getUserId",
        config: tokenFunction,
        data: {
          idToken: localStorage.getItem('id_token')
        }
      })
        .then(result => {
          const id = result.id
          if(!id) throw 'invalid id received from getFtUserId() ' + id
          localStorage.setItem('ft_user_id', id)
          idRequestInProgress = false
          return id
        })
        .catch(err => {
          idRequestInProgress = false
        })
      return userIdPromiseCache

    } else {
    //console.log('idRequestInProgress')
      //if there is a idRequestInProgress, return a promise the promiseCache will resolve
      return new Promise(resolve => setTimeout(resolve, 50, userIdPromiseCache))
    }
    
  }

  logout(skipRoute) {
    // Clear Access Token and ID Token from local storage
    localStorage.clear()
    localforage.clear()
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
    return timeOk && currentToken
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
      const promise = Promise.resolve(tokenValid)
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