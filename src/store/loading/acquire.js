// src/store/loading/acquire.js

import m from 'mithril'
import _ from 'lodash'
import localforage from 'localforage'
localforage.config({
	name: "FestiGram",
	storeName: "FestiGram"
})
import archive from './archive'
import {tokenFunction} from '../../services/requests.js'
import Auth from '../../services/auth.js'
const auth = new Auth()

//core
/*
[
'Artists',
'Images',
'Series',
'Festivals',
'Dates',
'Days',
'Sets',
'Lineups',
'Venues',
'Organizers',
'Places',
'ArtistPriorities',
'StagePriorities',
'StageLayouts',
'PlaceTypes',
'ArtistAliases',
'ParentGenres',
'Genres',
'ArtistGenres',
'MessageTypes',
'SubjectTypes',
]
*/
//core acquisition is done on app start if there is no core already present
/*
[

'Messages',
'MessagesMonitors',
'Intentions',
'Users',
]
*/

const loggedOnly = [
  /Intentions/,
  /MessagesMonitors/

]


export const coreCheck = () => localforage.getItem('Model.core')
	.then(coreData => coreData || window.mockery === true)
	.then(coreData => coreData || m.request({
	    method: 'GET',
	    url: '/api/' + 'Core/all/data',
	}))
	.then(data => data.data)
	.then(coreData => archive('core', coreData))
	//.then(data => console.dir('coreCheck data', data) && false || data)
	.then(coreData => Promise.all(_.map(coreData, (list, modelName) => archive(modelName, list))))
	.then(() => true)
	.catch(err => {
		console.error('acquire core error', err)
	})

export const coreChecked = coreCheck()

const headerBase = {
    'Content-Type': 'application/json'
   }

export function updateModel(modelName, queryString = '', url, simResponse) {
	let updated = false

	const reqUrl = url ? url + (queryString ? '?' : '') + (queryString) : `/api/${modelName}${queryString ? '?' : ''}${(queryString ? queryString : '')}`
	const localItem = `Model.${modelName}`
	const setModel = _.curry(archive)(modelName)
	//if(simResponse) console.log('acquire simResponse', simResponse)
	const resultChain = Promise.resolve(true)
		.then(() => {
			if(simResponse && simResponse.remoteData) return Promise[simResponse.remoteResult](simResponse.remoteData)
			return auth.getAccessToken()
				.catch(err => {
					if(err.error === 'login_required' || err === 'login required' || err === 'auth fail') return
					throw err
				})
				//.then(x => console.log('authResult', x) && x || x)
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
				.then(authResult => !_.isString(authResult) && loggedOnly.find(e => e.test(reqUrl)) ? [] : fetch(reqUrl, { 
				   	method: 'get', 
				   	headers: new Headers(
				   		_.isString(authResult) ? _.assign({}, headerBase, {Authorization: `Bearer ${authResult}`}) : headerBase
		   			)
				}))
				.then(response => response.json ? response.json() : response)
		})

		.then(response => _.isArray(response.data) || response.data && response.data.id ? response.data : response)
		/*
		.then(x => {
			console.log('resultChain', x)
			return x
		})
		*/
		.then(response => response.id ? [response] : response)
		
		
		.then(data => {updated = Boolean(data.length); return data})
		//.catch(err => console.error('updateModel resultChain err', err))
	const localChain = (simResponse && simResponse.localData ? Promise[simResponse.localResult](simResponse.localData) : (localforage.getItem(localItem)))
		.then(item => _.isArray(item) ? item : [])
	return Promise.all([resultChain, localChain])
		.then(([newData, oldData]) => {if(updated) return _.unionBy(newData, oldData, 'id');})
		.then(data => {if(data) return setModel(data);})
		.then(() => updated)
}

