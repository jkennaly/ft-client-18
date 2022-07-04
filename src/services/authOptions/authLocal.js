// src/services/authOptions/authLocal.js

import m from "mithril"
import _ from "lodash"
import localforage from "localforage"
import jwt_decode from "jwt-decode"
localforage.config({
	name: "FestiGram",
	storeName: "FestiGram",
})
const headerBase = {
	"Content-Type": "application/json"
}
import fetchT from "../fetchT"

const AUTH_DATA = typeof AUTH_CONFIG === "undefined" ? {} : AUTH_CONFIG

const scopeAr =
	"openid profile email admin create:messages verify:festivals create:festivals"

var userIdPromiseCache = {}
var nextIdRequestTime = 0
let accessTokenPromiseCache = {}
let userData = {}
var accessTokenPending = false
var dataReset = () => true
var cacheReset = () => true
var auth0 = {}
var authHandler = {}
var gttCache = ''
var lastToken, lastUserData

const tokenIsValid = token => {
	if (!token) return false
	const decoded = jwt_decode(token)
	const expiration = decoded.exp * 1000
	const now = Date.now()
	const expired = expiration - now < 0
	//console.log(expiration, now, expired)
	return !expired
}

const clean = () => {
	localStorage.clear()
	localforage
		.clear()
		.then(() => dataReset())
		//.then(() => console.log('data Reset'))
		.catch(err => console.error("logout data reset failed", err))

}
const authLoad = window.mockery
	? Promise.reject("mocked")
	: Promise.resolve(true)

/********************
start used in local logins

*********************/
var lastState = {}

const tokenFunction = token =>
	function (xhr) {
		xhr.setRequestHeader("Authorization", "Bearer " + token)
	}

const userIdFromToken = userData => async (token) => {
	const localId = JSON.parse(localStorage.getItem("ft_user_id"))
	if (localId) return localId
	try {
		const result = await m.request({
			method: "POST",
			url: "/api/Profiles/getUserId/",
			config: tokenFunction(token),
		})
		//console.log('result w/id', result)
		const id = result.id
		if (!id) throw "invalid id received from getFtUserId() " + id
		localStorage.setItem("ft_user_id", id)
		return id
	} catch (err) {
		console.error(err)
	}
}
/********************
end used in local logins

*********************/

export default class Auth {
	login(prev) {
		authLoad
			.then(() => {
				lastState = {
					route: prev,
				}
				window.location.assign(AUTH_DATA.LOGINURL)
			})
			.catch(err => console.error("login error", err))
	}

	handleAuthentication() {
		const query = window.location.href
		//console.log('local handleAuthentication', query)

		const token = query.match(/[?&]token=([^&]+).*$/)[1]
		//console.log('handleAuthentication query', query, token)

		//store the token
		localStorage.setItem("local_token", token)
		//console.log('local_token reload', localStorage.getItem('local_token'))
		//get the ftUserId
		return this.getFtUserId()
			.then(id => localStorage.setItem("ft_user_id", id))
			.then(() => this.getRoles())
			.then(roles =>
				localStorage.setItem("ft_user_roles", JSON.stringify(roles))
			)
	}

	gtt() {
		//console.log('auth gtt')
		//console.log(gttCache)
		return gttCache
	}

	userId() {
		//console.log('auth userId')
		//console.log(userIdCache)
		const local = JSON.parse(localStorage.getItem("ft_user_id"))
		if (local) return local
		return 0
	}

	userRoles() {
		//console.log('auth userId')
		//console.log(userIdCache)
		const local = JSON.parse(localStorage.getItem("ft_user_roles"))
		if (local) return local
		return []
	}

	//returns a promise that resolves to a userIdCache
	getFtUserId() {
		return Promise.all([
			this.getAccessToken(),
			this.getIdTokenClaims(),
		]).then(([token, claims]) => userIdFromToken(claims)(token))
	}
	recore(coreCheck) { }
	cacheCleaner(cleanCaches) { }

	logout(skipRoute) {
		// Clear Access Token and ID Token from local storage
		clean()
		window.location.assign("/")
	}

	isAuthenticated() {
		return this.getIdTokenClaims().then(
			claims => claims && claims.exp > Date.now() / 1000
		)
	}

	async getAccessToken() {
		//console.log('trying to retrieve token')
		const localToken = localStorage.getItem("local_token")
		const localValid = tokenIsValid(localToken)
		if (localValid) return localToken
		//try for refresh
		if (localToken) {
			try {
				const { token } = await m.request({
					method: "GET",
					url: "/authorize/refresh",
					timeout: 1000
				})
				if (token) {
					localStorage.setItem("local_token", token)
					return token
				}
			} catch (err) {
				//console.error('token refresh attempt failed')
				//console.log(err)
				if (err && err.code) {
					clean()
				}
			}
		}
		throw new Error('login required')
	}

	getGttRawRemote() {
		return (
			this.getAccessToken()
				.then(authResult =>
					_.isString(authResult) ? authResult : false
				)
				.then(authResult => {
					if (!_.isString(authResult))
						throw new Error("not authorized")
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
				.then(authResult =>
					fetchT("/api/Profiles/gtt", {
						method: "get",
						headers: new Headers(
							authResult
								? _.assign({}, headerBase, {
									Authorization: `Bearer ${authResult}`,
								})
								: headerBase
						),
					})
				)
				.then(response => {
					//console.log('gtt', response)
					if (_.isArray(response)) return response
					try {
						return response.json()
					} catch (err) {
						console.error(err)
						return []
					}
				})
				.then(json => json.token)
				.then(gtt => {
					gttCache = gtt
					return localforage.setItem("gtt.raw", gtt).then(() => gtt)
				})
				/*
	  .then(json => {
		console.log(json)
	  })
	  */
				.catch(err => {
					if (err.error === 'login_required' || err === 'login required' || err.message === 'login required' || err === 'auth fail') return
					console.error(err)
				})
		)
	}

	getGttRawLocal() {
		return localforage.getItem("gtt.raw")
	}

	getGttRaw() {
		return this.getGttRawLocal().then(local =>
			local ? local : this.getGttRawRemote()
		)
	}

	getGttDecoded() {
		return this.getGttRaw().then(jwt_decode)
	}

	getBothTokens() {
		//if(!auth0.getTokenSilently) throw new Error('Auth Service Bootstrapping')
		const access = this.getAccessToken()
		const gtt = this.getGttRaw()
		return Promise.all([access, gtt])
	}
	getIdTokenClaims() {
		return this.getAccessToken().then(jwt_decode)
	}
	getRoles() {
		return this.getIdTokenClaims().then(
			claims => claims["https://festigram/roles"]
		)
	}
}
