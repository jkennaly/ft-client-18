// acquire.js

import m from 'mithril'
import _ from 'lodash'
import localforage from 'localforage'
import {tokenFunction} from '../services/requests.js'
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

const setCore = _.curry(localforage.setItem)('core')

const coreCheck = () => localforage.getItem('core')
	.then(coreData => coreData || m.request({
	    method: 'GET',
	    url: '/api/' + 'Core/all/data',
	}))
	.then(setCore)
	.then(coreData => _.each(coreData, (list, modelName) => localforage.setItem(`Model.${modelName}`, list)))
	.then(() => true)
	.catch(err => {
		console.error('acquire core error', err)
	})

export const coreChecked = coreCheck()

export function updateModel(modelName, queryString = '', url) {
	const reqUrl = url ? url + queryString : `/api/${modelName}${queryString}`
	const localItem = `Model.${modelName}`
	const setModel = _.curry(localforage.setItem)(localItem)
	const resultChain = auth.getAccessToken()
		.then(authResult => m.request({
			method: 'GET',
			//use the dataFieldName after the last dot to access api
			url: reqUrl,
			config: tokenFunction(authResult),
			background: true
		}))
	const localChain = localforage.getItem(localItem)
		.then(item => _.isArray(item) ? item : [])
	return Promise.all([resultChain, localChain])
		.then(([newData, oldData]) => _.unionBy(newData, oldData, 'id'))
		.then(setModel)
		.then(() => true)
}

