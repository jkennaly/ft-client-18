// auth.js

import auth0 from 'auth0-js';
import AUTH0_DATA from './auth0-variables';
const m = require("mithril");
const Promise = require('promise-polyfill').default

const scopeAr = 'openid profile email admin create:messages verify:festivals create:festivals'

const setSession = function(authResult) {
    // Set the time that the Access Token will expire at
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    // navigate to the home route
    m.route.set('/conferences');
  }
const tokenFunction = function(xhr) {
  xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
}
export default class Auth {
  auth0 = new auth0.WebAuth({
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
      //console.log(authResult)
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        this.getFtUserId();
        m.route.set('/conferences');
      } else if (err) {
        m.route.set('/auth');
        console.log(err);
      }
    });
  }

  setSession = setSession

  getFtUserId() {
    const currentId = localStorage.getItem('ft_user_id')
    if(currentId) return Promise.resolve(currentId)
    const tokenValid = this.isAuthenticated()
    if(!tokenValid) return Promise.reject('current user is not authorized')
    const _this = this
    var promise = m.request({
          method: "GET",
          url: "/api/Users/getUserId",
          config: tokenFunction,
          data: {
            idToken: localStorage.getItem('id_token')
          }
      })
        .then(result => {
          const id = result.id
          if(!id) throw 'invalid id received from getFtUserId() ' + id
          localStorage.setItem('ft_user_id', id)
          return id
        })
    return promise
  }


  logout() {
    // Clear Access Token and ID Token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('ft_user_id');
    // navigate to the default route
    m.route.set('/auth');
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // Access Token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  getAccessToken() {
    const currentToken = localStorage.getItem('access_token')
    if(!currentToken) return Promise.reject('no logged in user; requires manual login')
    const tokenValid = this.isAuthenticated()
    const _this = this
    var promise = tokenValid ? Promise.resolve(currentToken) : new Promise((resolve, reject) => _this.auth0.checkSession({},
        function(err, result) {
          if (err) {
            reject(err);
          } else {
            setSession(result);
            resolve(result.accessToken)
          }
        }
    ))
    return promise
  }
}