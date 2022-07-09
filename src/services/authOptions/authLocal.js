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

const apiUrl = API_URL || 'https://api.festigram.app'

const scopeAr =
	"openid profile email admin create:messages verify:festivals create:festivals"


var dataReset = () => true

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
	dataReset()
	return (
		localforage
			.clear()
			//.then(() => console.log('data Reset'))
			.catch(err => console.error("logout data reset failed", err))
			.then(() => {
				if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
					//console.log("auth.logout: sw found", swCacheClear)
					return swCacheClear()
				}
			})
	)
}
const swCacheClear = () => {
	//console.log("auth.logout: clearing sw caches")
	var cacheWhitelist = []
	return caches.keys().then(cacheName => {
		const precache = /precache/.test(cacheName)
		const font = precache || /fonts/.test(cacheName)
		const img = font || /cloud-image/.test(cacheName)
		const save = img || cacheWhitelist.indexOf(cacheName) > -1
		return save ? caches.delete(cacheName) : Promise.resolve(true)
	})
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
			url: apiUrl + "/api/Profiles/getUserId/",
			config: tokenFunction(token),
		})
		//console.log('result w/id', result)
		const id = result.id
		if (!id) throw "invalid id received from getFtUserId() " + id
		if (_.isInteger(id)) localStorage.setItem("ft_user_id", id)
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
				window.location.assign(
					AUTH_DATA.LOGINURL +
					`?cb=${encodeURIComponent(AUTH_DATA.CALLBACKURL)}`
				)
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
		const local = localStorage.getItem("gtt")
		return local
	}

	userGtt() {
		//console.log('auth gtt')
		//console.log(gttCache)
		const local = this.gtt()
		if (local) return jwt_decode(local)
		return {}
	}

	userId() {
		//console.log('auth userId')
		//console.log(userIdCache)
		const local = parseInt(localStorage.getItem("ft_user_id"), 10)
		if (local) return local
		if (local === NaN) localStorage.clearItem("ft_user_id")
		return 0
	}

	userRoles() {
		//console.log('auth userId')
		//console.log(userIdCache)
		try {
			const local = JSON.parse(localStorage.getItem("ft_user_roles"))
			if (local) return local
		} catch (err) {
			return []
		}
	}

	//returns a promise that resolves to a userIdCache
	getFtUserId() {
		return Promise.all([
			this.getAccessToken(),
			this.getIdTokenClaims(),
		]).then(([token, claims]) => userIdFromToken(claims)(token))
	}

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
		if (localToken && !this.refreshing) {
			this.refreshing = true
			try {
				const { token } = await m.request({
					method: "GET",
					url: apiUrl + "/authorize/refresh",
					timeout: 1000,
					withCredentials: true
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
				} else {
					return ''
				}

			} finally {
				this.refreshing = false
			}
		}
		throw new Error('login required')
	}

	getGttRawRemote() {
		if (this.gettinGtt) return Promise.resolve('')
		this.gettinGtt = true
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
				.then(authResult =>
					fetchT(apiUrl + "/api/Profiles/gtt", {
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
					localStorage.setItem("gtt", gtt)
					this.gettinGtt = false
					return gtt
				})
				.catch(err => {
					if (err.error === 'login_required' || err === 'login required' || err.message === 'login required' || err === 'auth fail') return
					console.error(err)
				})
		)
	}

	async getGttRaw() {
		const local = this.gtt()
		return local ?? this.getGttRawRemote()
	}

	async getGttDecoded() {

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
			claims => claims["https://festigram.app/roles"]
		)
	}
	cacheCleaner(dataClear) {
		dataReset = dataClear
	}
}
