// src/store/loading/provide.js

import m from 'mithril'
import _ from 'lodash'
import localforage from 'localforage'
localforage.config({
	name: "FestiGram",
	storeName: "FestiGram"
})

const headerBase = {
	'Content-Type': 'application/json'
}
const formBase = {
	//'Content-Type': 'multipart/form-data'
}
import Auth from '../../services/auth.js'
const auth = Auth
const authOnly = [

'MessagesMonitors',
'Intentions',
'Interactions'
]
export default function (data, modelName, queryString = '', url, method = 'POST', simResponse, options = {}) {
	const reqUrl = url ? url + queryString : `/api/${modelName}${queryString}`
	const usingFormData = simResponse || data instanceof FormData
	const resultChain = simResponse && simResponse.remoteData ? Promise[simResponse.remoteResult](simResponse.remoteData) : (auth.getBothTokens()

		.then(([authResult, gtt]) =>  !_.isString(authResult) && authOnly.includes(modelName) ? {ok: true, json: () => []} : fetch(reqUrl, { 

		   	method: method, 
		   	headers: new Headers(
		   		_.isString(authResult) ? _.assign({}, (options.form ? formBase : headerBase), {
		   			Authorization: `Bearer ${authResult}`,
		   			"X-GT-Access-Token": gtt

		   		}) : (options.form ? formBase : headerBase)
   			),
			body: (options.form ? data : JSON.stringify(data)) 
		}))
		.then(response => {
			if(_.isArray(response)) return response
			try {
				return response.json()
			} catch (err) {
				console.error(err)
				return []
			}

		})
	)
	return resultChain
}

