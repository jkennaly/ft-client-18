// auth.js

import auth00 from '@auth0/auth0-spa-js';
import AUTH0_DATA from './auth0-variables';
import m from 'mithril'
import _ from 'lodash'
import localforage from 'localforage'
localforage.config({
  name: "FestiGram",
  storeName: "FestiGram"
})
import emptyPromise from 'empty-promise'
//const Promise = require('promise-polyfill').default
//import {tokenFunction} from './requests'

const scopeAr = 'openid profile email admin create:messages verify:festivals create:festivals'


  
const tokenFunction = token => function(xhr) {
  xhr.setRequestHeader('Authorization', 'Bearer ' + token)
}


const userIdFromToken = userData => token => m.request({
  method: "POST",
  url: "/api/Profiles/getUserId/",
  config: tokenFunction(token),
  body: userData
})
.then(result => {
  const id = result.id
  if(!id) throw 'invalid id received from getFtUserId() ' + id
  return id
})

var userIdPromiseCache = {}
var nextIdRequestTime = 0
let accessTokenPromiseCache = {}
let userData = {}
var accessTokenPending = false
var userIdCache = 0
var userRoleCache = []
var dataReset = () => true
var auth0 = {}
var authHandler = {}
const authLoad = window.mockery ? Promise.reject('mocked') : (auth00({
    domain: AUTH0_DATA.DOMAIN,
    client_id: AUTH0_DATA.CLIENTID,
    redirect_uri: AUTH0_DATA.CALLBACKURL,
    audience: AUTH0_DATA.AUDIENCE,
    scope: scopeAr
  })
  .then(o => auth0 = o)
  .then(() => 'authLoaded')
  .catch(err => err !== 'mocked' && console.error('auth0 instantiantion failed', err))
)
var lastToken
export default class Auth {
  

  login(prev) {
    authLoad
    /*
      .then(hrcb => {
          console.log('authLoad', hrcb)
          return hrcb
      })
      */
      .then(() => auth0.loginWithRedirect({
        appState: {
          route: prev
        }
      }))
      .catch(err => console.error('login error', err))
  }


  handleAuthentication() {
    //console.log('handleAuthentication')
    return authLoad
      .then(hrcb => {
          //console.log('authLoad for handleAuthentication', hrcb)
          return hrcb
      })
      .then(() => {
        const query = window.location.search
        const handling = /code/.test(query) && /state/.test(query)

        if(!handling) throw 'not handling'
      })
      //.catch(err => {if(err === 'not handling') return; console.error(err)})
      .then(() => auth0.handleRedirectCallback())
      .then(x => {
        //console.log('handleRedirectCallback', x)
        return x
      })
      .then(redirect => {
        return auth0.getUser()
          .then(user => {
            //console.log('auth0.getUser', user);
            return userData = user
          })
          .then(user => this.getFtUserId(user))
          .then(id => {
            //console.log('setting id')
            localStorage.setItem('ft_user_id', id)
          })
          .then(() => this.getRoles().then(roles => userRoleCache = roles))
          //.then(() => m.redraw())
          .then(() => window.history.replaceState({}, document.title, "/#!/launcher"))
          .then(() => redirect)
          .catch(err => {
            //if(err === 'Invalid state' || err.Error === "There are no query params available for parsing.") return
            console.error('handleRedirectCallback', err)
          })
         
      })
      .catch(err => {
        if(err === 'mocked') return
        if(err === 'not handling') return
        console.error('handleAuthentication', err)
      })
      //.then(({appState}) => m.route.set(appState && appState.route ? appState.route : '/launcher'))
      //.then(() => window.history.replaceState({}, document.title, "/#!/launcher"))
      /*
      .then(hrcb => {
          console.log('redirected', hrcb)
          return hrcb
      })
      */
      //.then(() => this.getFtUserId('handleAuthentication'))
      /*
      .then(() => {})
      */
  }


  userId() {
    //console.log('auth userId')
    //console.log(userIdCache)
    return userIdCache
  }


  userRoles() {
    //console.log('auth userId')
    //console.log(userIdCache)
    return userRoleCache
  }

  //returns a promise that resolves to a userIdCache
  getFtUserId(userData) {
    const onAuthRoute = /auth/.test(window.location)
    if(onAuthRoute) return Promise.resolve(0)
    const localUser = parseInt(localStorage.getItem('ft_user_id'), 10)
    if(localUser) return Promise.resolve(localUser)
    if(userIdPromiseCache.then) return userIdPromiseCache

    userIdPromiseCache = authLoad
      .then(() => this.getValidToken())
      //.then(idToken => [console.log('userIdPromiseCache idToken', idToken), idToken][1])
      .then(userIdFromToken(userData))
      //.then(userId => [console.log('userIdPromiseCache userId', userId), userId][1])

    
      .catch(err => {
          userIdCache = 0
        localStorage.setItem('ft_user_id', 0)
        console.error('userIdPromiseCache failed', err)
      })
    return userIdPromiseCache

  }
  recore (coreCheck) {
    dataReset = coreCheck
  }

  logout(skipRoute) {
    // Clear Access Token and ID Token from local storage
    localStorage.clear()
    localforage.clear()
      .then(() => dataReset())
      .then(() => console.log('data Reset'))
      .catch(err => console.error('logout data reset failed', err))
    userIdCache = 0
    userRoleCache = []
    auth0.logout({client_id: AUTH0_DATA.CLIENTID, returnTo:AUTH0_DATA.CALLBACKURL})
    // navigate to the default route
    //if(!skipRoute) m.route.set('/')
  }

  isAuthenticated() {
    if(!localStorage.getItem('ft_user_id')) return Promise.reject('login required')
    
    return authLoad
      .then(() => auth0.isAuthenticated())
  }

  getValidToken() {
    //if(!auth0.getTokenSilently) throw new Error('Auth Service Bootstrapping')
    return authLoad
      .then(() => auth0.getTokenSilently())
  
  }

  getAccessToken() {
    //this returns a promise that resolves to a valid token
    return authLoad
      .then(() => this.isAuthenticated())
      .then(status => status && lastToken ? lastToken : this.getValidToken())
  }
  getIdTokenClaims()  {
    return authLoad
      .then(() => auth0.getIdTokenClaims())
  }
  getRoles() {
    return this.getIdTokenClaims()
      .then(claims => claims ? claims["https://festigram/roles"] : [])
      //.then(roles => console.log('roles', roles) || roles)

  }
}