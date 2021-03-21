// auth0.js

import auth00 from '@auth0/auth0-spa-js';
import m from 'mithril'
import _ from 'lodash'
import localforage from 'localforage'
import jwt_decode from 'jwt-decode'
import {subjectBought} from './gtt'
localforage.config({
  name: "FestiGram",
  storeName: "FestiGram"
})
const headerBase = {
  'Content-Type': 'application/json'
}

const AUTH0_DATA = typeof AUTH_CONFIG === 'undefined' ? {} : AUTH_CONFIG


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
var cacheReset = () => true
var auth0 = {}
var authHandler = {}
var lastToken, lastUserData

const clean = () => {

    localStorage.clear()
    userIdCache = 0
    userRoleCache = []

    userIdPromiseCache = {}
    nextIdRequestTime = 0
    accessTokenPromiseCache = {}
    return localforage.clear()
      //.then(() => console.log('data Reset'))
      .catch(err => console.error('logout data reset failed', err))
}
var authLoad
export default class Auth {
  
  constructor() {
    if(authLoad) return
    authLoad = true
    authLoad = window.mockery ? Promise.reject('mocked') : (auth00({
      domain: AUTH0_DATA.DOMAIN,
      client_id: AUTH0_DATA.CLIENTID,
      redirect_uri: AUTH0_DATA.CALLBACKURL,
      audience: AUTH0_DATA.AUDIENCE,
      scope: scopeAr,
      cacheLocation: 'localstorage'
    })
    .then(o => auth0 = o)
    .then(o => o.getTokenSilently())
    .then(status => {
      if(!status) {
        localStorage.setItem('ft_user_id', 0)
        throw 'auth fail'
      }
      return status
    })
    .then(() => this.getFtUserId())
    .then(id => {
      //console.log('setting id')
      localStorage.setItem('ft_user_id', id)
    })
      .then(() => auth0.getIdTokenClaims())
      .then(claims => claims ? claims["https://festigram/roles"] : [])
    /*
    .then(() => this.getRoles())
    */
    .then(roles => userRoleCache = roles)
    .then(roles => {
      //console.log('setting roles')
      localStorage.setItem('ft_user_roles', JSON.stringify(roles))
    })
    .then(() => 'authLoaded')
    .catch(err => {
      if(err.error === 'login_required') {
        const lastId = localStorage.getItem('ft_user_id')
        return lastId ? clean() : undefined
      } 
      err !== 'mocked' && err !== 0 && console.error('auth0 instantiantion failed', err)

    })
  )
  }

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
          .then(() => this.getRoles())
          .then(roles => userRoleCache = roles)
          .then(roles => {
            //console.log('setting roles')
            localStorage.setItem('ft_user_roles', JSON.stringify(roles))
          })
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
    return parseInt(localStorage.getItem('ft_user_id'), 10)
  }


  userRoles() {
    //console.log('auth userId')
    //console.log(userIdCache)
    return JSON.parse(localStorage.getItem('ft_user_roles'))
  }

  //returns a promise that resolves to a userIdCache
  getFtUserId(userDataSupplied) {
    const userData = userDataSupplied ? userDataSupplied : lastUserData
    lastUserData = userData
    const onAuthRoute = /auth/.test(window.location)
    if(onAuthRoute) return Promise.resolve(0)
    const localUser = parseInt(localStorage.getItem('ft_user_id'), 10)
    if(localUser) return Promise.resolve(localUser)
    if(userIdPromiseCache.then) return userIdPromiseCache
    if(!localUser && !userData) return Promise.reject(0)
    //console.log('getFtUserId', userData)
    //console.trace()
    userIdPromiseCache = authLoad
      .then(() => this.getValidToken())
      //.then(accessToken => [console.log('userIdPromiseCache userData', userData, console.trace()), accessToken][1])
      .then(userIdFromToken(userData))
      .then(id => {
        this.cacheCleaner()
        return id
      })
      //.then(userId => [console.log('userIdPromiseCache userId', userId), userId][1])

    
      .catch(err => {
          userIdCache = 0
        localStorage.setItem('ft_user_id', 0)
        //console.error('userIdPromiseCache failed', err)
      })
    return userIdPromiseCache

  }
  recore (coreCheck) {
    dataReset = coreCheck
  }
  cacheCleaner (cleanCaches) {
    cacheReset = cleanCaches
  }

  logout(skipRoute) {
    // Clear Access Token and ID Token from local storage
    return clean()
      .finally(() => auth0.logout({client_id: AUTH0_DATA.CLIENTID, returnTo:AUTH0_DATA.CALLBACKURL}))

    
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

  getAccessToken(opts) {
    //this returns a promise that resolves to a valid token

    if(accessTokenPromiseCache.then) return accessTokenPromiseCache
    accessTokenPromiseCache = authLoad
      .then(() => this.isAuthenticated())
      .then(authd => {
        if(!authd) throw new Error('no auth, no token')
      })
      .then(() => this.getValidToken())
      .catch(err => accessTokenPromiseCache = {})
    return accessTokenPromiseCache

  }

  getGttRawRemote() {
    return userIdPromiseCache
      .then(() => this.getAccessToken())
      .then(authResult => _.isString(authResult) ? authResult : false)
      .then(authResult => {
        if(!_.isString(authResult) || !authResult) throw new Error('not authorized')
        return authResult
      })
      /*
      .then(authResult => { 
        console.log('updateModel reqUrl', reqUrl)
        const req = m.request({
            method: 'GET',
            url: reqUrl,
          config: tokenFunction(authResult),
          background: true
        })
        console.log('req', req)
        req.then(x => console.log('updateModel response') && x || x)
        req.catch(x => console.log('updateModel err', x))
        return req
      })
      */
      .then(authResult => fetch('/api/Profiles/gtt', { 
          method: 'get', 
          headers: new Headers(
            authResult ? _.assign({}, headerBase, {Authorization: `Bearer ${authResult}`}) : headerBase
          )
      }))
      .then(response => {
        //console.log('gtt', response)
        if(_.isArray(response)) return response
        try {
          return response.json()
        } catch (err) {
          console.error(err)
          return []
        }

      })
      .then(json => json.token)
      .then(gtt => localforage.setItem('gtt.raw', gtt).then(() => gtt))
      /*
      .then(json => {
        console.log(json)
      })
      */
      .catch(err => {
        if(err.message === 'not authorized') return ''
        if(/JSON\.parse/.test(err.message)) {
          return localforage.setItem('gtt.raw', '')
        }
        console.error(err)
      })
  }

  getGttRawLocal() {
    return localforage.getItem('gtt.raw')
      .catch(err => {})
  }

  getGttRaw() {
    return this.isAuthenticated()
      .then(auth => {if(!auth) throw 'No auth'})
      .then(this.getGttRawLocal)
      .then(local => _.isString(local) && local ? local : this.getGttRawRemote())
      .then(raw => raw ? raw : '')
      .catch(err => '')
  }

  getGttDecoded() {
    return this.getGttRaw()
      .then(jwt_decode)
      .then(raw => raw ? raw : {})
      .catch(err => {})

  }

  //has gtt access will return false for past events that are accessible
  hasGttAccess(so) {
    return this.getGttDecoded()
      //.then(baseAccess => console.log('hasGttAccess getGttDecoded', baseAccess) || baseAccess)
        
      .then(subjectBought(so))

  }

  getBothTokens() {
    //if(!auth0.getTokenSilently) throw new Error('Auth Service Bootstrapping')
    const access = authLoad
      .then(() => this.getValidToken())
      .then(raw => raw ? raw : '')
      .catch(() => '')

    const gtt = this.getGttRaw()
      .catch(() => '')
    return Promise.all([access, gtt])

      //.then(x => console.log('getBothTokens', x) && x || x)
  
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
