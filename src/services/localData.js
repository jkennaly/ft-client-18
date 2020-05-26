// localData.js

import _ from 'lodash'
import localforage from 'localforage'
localforage.config({
	name: "Client-44",
	storeName: "Client-44"
})
import moment from 'moment'

export const defaultMeta = () => {return {calcTime: Date.now(), timestamps: [Infinity, 0], ids: [Infinity, 0]}} 


const validMeta = meta => meta && meta.timestamps && meta.timestamps.length &&
	meta.ids && meta.ids.length

export const combineMetas = (a, b) => { return {
	calcTime: Date.now(), 
	timestamps: [
		a.timestamps[0] < b.timestamps[0] ? a.timestamps[0] : b.timestamps[0],
		a.timestamps[1] > b.timestamps[1] ? a.timestamps[1] : b.timestamps[1]
	],
	ids: [
		a.ids[0] < b.ids[0] ? a.ids[0] : b.ids[0],
		a.ids[1] > b.ids[1] ? a.ids[1] : b.ids[1]
	]
}}
export const metaQuivalent = (a, b) => { 
	return a.timestamps[0] === b.timestamps[0] &&
		a.timestamps[1] === b.timestamps[1] &&
		a.ids[0] === b.ids[0] &&
		a.ids[1] === b.ids[1]
}

const combineWithLocalMetaPromise = dataFieldName => newMeta => localforage
	.getItem(dataFieldName + '_meta')
	.then(oldMeta => {
		//console.log('combineWithLocalMetaPromise dataFieldName ' + dataFieldName)
		//console.log(oldMeta)
		//console.log(newMeta)
		const oldValid = validMeta(oldMeta)
		const newValid = validMeta(newMeta)
		if(!newValid) throw dataFieldName + ' invalid meta: ' + JSON.stringify(newMeta)
		const combinedMeta = oldValid ? combineMetas(newMeta, oldMeta) : newMeta
		return combinedMeta
	})
	.then(newLocalMeta => {
		localforage.setItem(dataFieldName + '_meta', newLocalMeta)
		return newLocalMeta
	})
		.catch(err => console.error(err))


export const calcMeta = data => (data && data.data ? data.data : (data ? data : []))
	.reduce((metaTemp, el, index, arr) => {
		const m = moment(el.timestamp).valueOf()
		const i = el.id

		const oldest = m && m < metaTemp.timestamps[0]
		const newest = m && m > metaTemp.timestamps[1]
		metaTemp.timestamps[0] = oldest ? m : metaTemp.timestamps[0]
		metaTemp.timestamps[1] = newest ? m : metaTemp.timestamps[1]

		const lowest = i && i < metaTemp.ids[0]
		const highest = i && i > metaTemp.ids[1]
		metaTemp.ids[0] = lowest ? i : metaTemp.ids[0]
		metaTemp.ids[1] = highest ? i : metaTemp.ids[1]

		metaTemp.length = index + 1

		return metaTemp
	}, defaultMeta())


export const unionLocalList = (dataFieldName, options = {updateMeta: false}) => {
	const oldDataPromise = localforage.getItem(dataFieldName)
	return newData => oldDataPromise
		.then(oldData => {
			//if there's no old data, save the entire result[0]
			const mergedData = !oldData || !oldData.length ? newData : _.unionBy(newData, oldData, 'id')
			if(options.updateMeta) {
				const newMeta = calcMeta(newData)
				combineWithLocalMetaPromise(dataFieldName)(newMeta)


			}

			localforage.setItem(dataFieldName, mergedData)

			return newData
		})
		.catch(err => console.error(err))
}