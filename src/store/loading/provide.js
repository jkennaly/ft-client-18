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
const apiUrl = API_URL || 'https://api.festigram.app'
export default function (
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
	const resultChain =
		simResponse && simResponse.remoteData
			? Promise[simResponse.remoteResult](simResponse.remoteData)
			: auth
				.getBothTokens()
				//.then(x => console.log('provide result', x) || x)
				.then(([authResult, gtt]) =>
					!_.isString(authResult) && authOnly.includes(modelName)
						? { ok: true, json: () => [] }
						: fetchT(reqUrl, {
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
				)
				.then(response => {
					//console.log('provide', response)
					if (!response) return []
					if (_.isArray(response)) return response
					try {
						const resp = response.json()
						return resp
					} catch (err) {
						console.log("JSON err", err)
						if (!/JSON\.parse/.test(err.message))
							console.error(err)
						return []
					}
				})
				.catch(err => {
					if (!/JSON\.parse/.test(err.message)) {
						console.error(err)
						throw err
					}
				})
	return resultChain
}
