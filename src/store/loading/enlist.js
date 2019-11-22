// enlist.js

import _ from 'lodash'
import localforage from 'localforage'
localforage.config({
	name: "FestiGram",
	storeName: "FestiGram"
})
import {updateModel, coreChecked} from './acquire.js'
//pull data from localforage and convert into an array



export function loadModel(modelName) {
	const localItem = `Model.${modelName}`
	return localforage.getItem(localItem)
}

export function coreLoaded(modelName) {

	coreChecked
		.then()
}

//if there is no data, run acquire and then try again

export function getList(modelName) {
	return coreChecked
		.then(() => loadModel(modelName))
		.then(local => local || (
			updateModel(modelName)
				.then(() => loadModel(modelName))
		))
		.then(list => _.isArray(list) && list || [])
		//.then(data => console.dir('getList data ' + modelName) && false || data)
}