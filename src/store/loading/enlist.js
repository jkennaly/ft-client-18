// enlist.js

import _ from 'lodash'
import localforage from 'localforage'
import {updateModel, coreChecked} from './acquire.js'
//pull data from localforage and convert into an array

function loadModel(modelName) {
	const localItem = `Model.${modelName}`
	const setModel = _.curry(localforage.setItem)(localItem)
	return localforage.getItem(localItem)
}

//if there is no data, run acquire and then try again

export function getList(modelName) {
	return coreChecked
		.then(() => loadModel(modelName))
		.then(local => local || (
			updateModel(modelName)
				.then(() => loadModel(modelName))
		))
}