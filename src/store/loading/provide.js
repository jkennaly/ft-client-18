// src/store/loading/provide.js

import m from 'mithril'
import _ from 'lodash'
import localforage from 'localforage'
localforage.config({
	name: "FestiGram",
	storeName: "FestiGram"
})
import {tokenFunction} from '../../services/requests.js'

const headerBase = {
	'Content-Type': 'application/json'
}
const formBase = {
	//'Content-Type': 'multipart/form-data'
}
import Auth from '../../services/auth.js'
const auth = new Auth()

const loggedOnly = [
  /Intentions/,
  /MessagesMonitors/

]
export default function (data, modelName, queryString = '', url, method = 'POST', simResponse, options = {}) {
	const reqUrl = url ? url + queryString : `/api/${modelName}${queryString}`
	const usingFormData = simResponse || data instanceof FormData
	const resultChain = simResponse && simResponse.remoteData ? Promise[simResponse.remoteResult](simResponse.remoteData) : (auth.getAccessToken()
		.then(authResult => !_.isString(authResult) && loggedOnly.find(e => e.test(reqUrl)) ? [] : fetch(reqUrl, { 
		   	method: method, 
		   	headers: new Headers(
		   		_.isString(authResult) ? _.assign({}, (options.form ? formBase : headerBase), {Authorization: `Bearer ${authResult}`}) : (options.form ? formBase : headerBase)
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
/*
		.then(authResult => m.request({
			method: method,
			//use the dataFieldName after the last dot to access api
			url: reqUrl,
			config: tokenFunction(authResult),
			body: data,
			background: true
		})))
		*/
	return resultChain
}

