// authLocal.js

import m from 'mithril'
import _ from 'lodash'
import localforage from 'localforage'
import jwt_decode from 'jwt-decode'
localforage.config({
  name: "FestiGram",
  storeName: "FestiGram"
})

const AUTH_DATA = typeof AUTH_CONFIG === 'undefined' ? {} : AUTH_CONFIG


const scopeAr = 'openid profile email admin create:messages verify:festivals create:festivals'


  


var userIdPromiseCache = {}
var nextIdRequestTime = 0
let accessTokenPromiseCache = {}
let userData = {}
var accessTokenPending = false
var userIdCache = 0
var userRoleCache = []
var dataReset = () => true
var cacheReset = () => true
var auth0 = {}
var authHandler = {}
var lastToken, lastUserData

const clean = () => {

    localStorage.clear()
    localforage.clear()
      .then(() => dataReset())
      //.then(() => console.log('data Reset'))
      .catch(err => console.error('logout data reset failed', err))
    userIdCache = 0
    userRoleCache = []
}
const authLoad = window.mockery ? Promise.reject('mocked') : Promise.resolve(true)

/********************
start used in local logins

*********************/
var lastState = {}

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
/********************
end used in local logins

*********************/


export default class Auth {
  

  login(prev) {
    authLoad
      .then(() => {
        lastState = {
          route: prev
        }
        window.location.assign(AUTH_DATA.LOGINURL)
      })
      .catch(err => console.error('login error', err))
  }


  handleAuthentication() {
    const query = window.location.href
    //console.log('local handleAuthentication', query)

    const token = query.match(/[?&]token=([^&]+).*$/)[1]
    //console.log('handleAuthentication query', query, token)

    //store the token
    localStorage.setItem('local_token', token)
    //console.log('local_token reload', localStorage.getItem('local_token'))
    //get the ftUserId
    return this.getFtUserId()
      .then(id => localStorage.setItem('ft_user_id', id))
      .then(() => this,getRoles())
      .then(roles => localStorage.setItem('ft_user_roles', JSON.stringify(roles)))
  }


  userId() {
    //console.log('auth userId')
    //console.log(userIdCache)
    return JSON.parse(localStorage.getItem('ft_user_id'))
  }



  userRoles() {
    //console.log('auth userId')
    //console.log(userIdCache)
    return JSON.parse(localStorage.getItem('ft_user_roles'))
  }

  //returns a promise that resolves to a userIdCache
  getFtUserId() {
    
    return Promise.all([this.getValidToken(), this.getIdTokenClaims()])
      .then(([token, claims]) => userIdFromToken(claims)(token))


  }
  recore (coreCheck) {
  }
  cacheCleaner (cleanCaches) {
  }

  logout(skipRoute) {
    // Clear Access Token and ID Token from local storage
    clean()
    window.location.assign('/')
  }

  isAuthenticated() {
    return this.getIdTokenClaims()
      .then(claims => claims && claims.exp > (Date.now() / 1000))
      
  }

  getValidToken() {
    //if(!auth0.getTokenSilently) throw new Error('Auth Service Bootstrapping')
    return Promise.resolve(localStorage.getItem('local_token'))
  
  }

  getAccessToken(opts) {
    //this returns a promise that resolves to a valid token

   return this.getValidToken()

  }
  getIdTokenClaims()  {
    return this.getValidToken()
      .then(jwt_decode)
  }
  getRoles() {
    return this.getIdTokenClaims()
      .then(claims => claims['https://festigram/roles'])
  }
}
