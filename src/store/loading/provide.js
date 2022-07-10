// src/store/loading/provide.js

import m from "mithril"
import _ from "lodash"
import localforage from "localforage"
localforage.config({
	name: "FestiGram",
	storeName: "FestiGram",
})

const headerBase = {
	"Content-Type": "application/json",
}
const formBase = {
	//'Content-Type': 'multipart/form-data'
}
import fetchT from "../../services/fetchT"
import Auth from "../../services/auth"
const auth = Auth
const authOnly = ["MessagesMonitors", "Intentions", "Interactions"]
const authOnlyRoutes = ['bucks', 'access']
const apiUrl = API_URL || 'https://api.festigram.app'
export default async function (
	data,
	modelName,
	queryString = "",
	url,
	method = "POST",
	simResponse,
	options = {}
) {
	const reqUrl = url ? apiUrl + url + queryString : `${apiUrl}/api/${modelName}${queryString}`
	const usingFormData = simResponse || data instanceof FormData
	//console.log('providing', reqUrl, method, data, modelName, queryString, simResponse)
	if (simResponse && simResponse.remoteData) return Promise[simResponse.remoteResult](simResponse.remoteData)
	const [authResult, gtt] = await Promise.all([
		auth.getAccessToken(), auth.getGttRaw()
	])
	const authValid = authResult && _.isString(authResult)
	const authOnlyRequest = authOnly.includes(modelName) || authOnlyRoutes.some(r => url.includes(r))
	console.log('authValid', authValid, authOnlyRequest, url)
	if (authOnlyRequest && !authValid) return []
	try {
		const response = await fetchT(reqUrl, {
			method: method,
			headers: new Headers(
				_.isString(authResult)
					? _.assign(
						{},
						options.form
							? formBase
							: headerBase,
						{
							Authorization: `Bearer ${authResult}`,
							"X-GT-Access-Token": gtt,
						}
					)
					: options.form
						? formBase
						: headerBase
			),
			body: options.form
				? data
				: JSON.stringify(data),
		})
		console.log('provide', response)
		if (!response) return []
		if (_.isArray(response)) return response
		try {
			const resp = await response.json()
			return resp
		} catch (err) {
			console.log("JSON err", err)
			if (!/JSON\.parse/.test(err.message))
				console.error(err)
			return []
		}
	} catch (err) {
		if (!/JSON\.parse/.test(err.message)) {
			console.error(err)
			throw err
		}
	}
}
