// src/store/loading/provide.js

import m from 'mithril'
import _ from 'lodash'
import localforage from 'localforage'
localforage.config({
	name: "FestiGram",
	storeName: "FestiGram"
})

const headerBase = {
	//'Content-Type': 'test/plain'
}

export default function (url, headers, body, method = 'GET') {
	if(!url) return Promise.reject('No URL for foreign request')
	const resultChain = fetch(url, { 
		   	method: method, 
		   	headers: new Headers(
		   		headers ? headers : headerBase
   			),
			body: !body || _.isString(body) ? body : JSON.stringify(body)
		})
		.then(response => {
			//console.log('provide', response)
			if(_.isArray(response)) return response
			try {
				return response.json()
			} catch (err) {
				console.error(err)
				return []
			}

		})
		.catch(err => {
			console.error(err)
			throw err
		})
	
	return resultChain
}

