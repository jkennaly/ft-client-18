// sort.js

const _ = require('lodash')

import fieldSelecter from './fieldSelecter.js'

const sort = {
	unsorted: (a, b) => 0,
	alphaAsc: (funcName, fieldName) => (a, b) => fieldSelecter[funcName](a[fieldName]).localeCompare(fieldSelecter[funcName](b[fieldName])),
	alphaDesc: (funcName, fieldName) => (a, b) => fieldSelecter[funcName](b[fieldName]).localeCompare(fieldSelecter[funcName](a[fieldName])),
	desc: (funcName, fieldName) => (a, b) => fieldSelecter[funcName](b[fieldName]) - (fieldSelecter[funcName](a[fieldName]))

}

exports.availableSelecters = {
	unsorted: [],
	alphaAsc: ['artistName'],
	alphaDesc: ['artistName'],
	desc: ['averageSetRating']
}

exports.selecterIdFields = {
	artist: ['band'],
	average: ['id']
}

exports.possibleSelecters = sortName => fieldNames => {
	//console.log('sort possibleSelecters')
	if(!fieldNames || !fieldNames.length) return []
	//console.log(sortName)
	//console.log(fieldNames)
	//console.log(_.some(['band'], v => fieldNames.indexOf(v) > -1))
	const idTypes = Object.keys(exports.selecterIdFields)
		.filter(k => _.some(exports.selecterIdFields[k], v => fieldNames.indexOf(v) > -1))
	//const idTypes = _.find(exports.selecterIdFields, f => _.some(f, v => fieldNames.indexOf(v) > -1))
	const selecters = exports.availableSelecters[sortName]
		.filter(sel => idTypes.filter(type => sel.indexOf(type) === 0).length)
	//console.log(idTypes)
	//console.log(selecters)
	return selecters
}

exports.selecterFields = selecter => _.uniq(_.flatMap(Object.keys(exports.selecterIdFields)
	.filter(selecterType => selecter.indexOf(selecterType) === 0),
	t => exports.selecterIdFields[t]))

export default sort