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
  getIdTokenClaims()  {
    return Promise.resolve([])
  }
  getRoles() {
    return ['user', 'admin']

  }
}
