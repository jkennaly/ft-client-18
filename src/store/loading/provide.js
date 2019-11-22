// provide.js

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
import Auth from '../../services/auth.js'
const auth = new Auth()

export default function (data, modelName, queryString = '', url, method = 'POST', simResponse) {
	const reqUrl = url ? url + queryString : `/api/${modelName}${queryString}`
	const resultChain = simResponse && simResponse.remoteData ? Promise[simResponse.remoteResult](simResponse.remoteData) : (auth.getAccessToken()
		.then(authResult => fetch(reqUrl, { 
		   	method: method, 
		   	headers: new Headers(
		   		authResult ? _.assign({}, headerBase, {Authorization: `Bearer ${authResult}`}) : headerBase
   			),
			body: JSON.stringify(data)
		}))
		.then(response => response.json())
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

