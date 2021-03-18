// src/services/authOptions/authNoToken.js

import m from 'mithril'
import _ from 'lodash'
import localforage from 'localforage'
localforage.config({
  name: "FestiGram",
  storeName: "FestiGram"
})


export default class Auth {
  

  login(prev) {
    
  }


  handleAuthentication() {
    //console.log('handleAuthentication')
    return Promise.resolve(1)
  }


  userId() {
    //console.log('auth userId')
    //console.log(userIdCache)
    return 1
  }


  userRoles() {
    //console.log('auth userId')
    //console.log(userIdCache)
    return ['user', 'admin']
  }

  //returns a promise that resolves to a userIdCache
  getFtUserId(userDataSupplied) {
    
    return Promise.resolve(1)

  }
  recore (coreCheck) {
  }
  cacheCleaner (cleanCaches) {
  }

  logout(skipRoute) {
    // Clear Access Token and ID Token from local storage
    clean()
  }

  isAuthenticated() {
    return Promise.resolve(false)
      
  }

  getValidToken() {
    //if(!auth0.getTokenSilently) throw new Error('Auth Service Bootstrapping')
    return Promise.resolve('abc')
  
  }

  getAccessToken(opts) {
    //this returns a promise that resolves to a valid token

   return Promise.resolve('abc')

  }

  getGttRawRemote() {
    return this.getAccessToken()
      .then(authResult => _.isString(authResult) ? authResult : false)
      .then(authResult => {
        if(!_.isString(authResult)) throw new Error('not authorized')
        return authResult
      })
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
        //if(err.error === 'login_required' || err === 'login required' || err === 'auth fail') return
        console.error(err)
      })
  }

  getGttRawLocal() {
    return localforage.getItem('gtt.raw')
  }

  getGttRaw() {
    return this.getGttRawLocal()
      .then(local => local ? local : this.getGttRawRemote())
  }

  getGttDecoded() {
    return this.getGttRaw()
      .then(jwt_decode)

  }

  getBothTokens() {
    //if(!auth0.getTokenSilently) throw new Error('Auth Service Bootstrapping')
    const access = authLoad
    const gtt = this.getGttRaw()
    return Promise.all([access, gtt])
  
  }
  getIdTokenClaims()  {
    return Promise.resolve([])
  }
  getRoles() {
    return ['user', 'admin']

  }
}
