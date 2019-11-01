// DataList.js


import _ from 'lodash'
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min'

import {unionLocalList, calcMeta, defaultMeta, combineMetas} from '../../services/localData.js'
import {updateModel} from '../loading/acquire'
import {getList} from '../loading/enlist'
//A DataList object contains the minimum to interact with the festivaltime api

function DataList(opt = {}) {
	if(!opt.fieldName) throw "Invalid list fieldName"
	this.fieldName = opt.fieldName
	this.list = []
	this.meta = defaultMeta()
	this.core = true
	this.remoteInterval = opt.remoteInterval ? opt.remoteInterval : 3600
	this.lastRemoteLoad = 0
	this.lastRemoteCheck = 0
	this.baseEndpoint = `/api/${this.fieldName}`
}

DataList.prototype.setMeta = function(meta) {
	if(!this) throw "Invalid DataList call setMeta"
	return this.meta = _.clone(meta)
}

DataList.prototype.getMeta = function() {
	if(!this) throw "Invalid DataList call setMeta"
		//console.log('getMeta', this.meta, this.list.length)
	return _.clone(this.meta)
}

DataList.prototype.replaceList = function(data) {
	if(!this) throw "Invalid DataList call replaceList"
	const list = _.isArray(data) ? data : []
	this.setMeta(calcMeta(list))
	this.list = _.clone(list)
	this.lastRemoteLoad = Date.now()
	this.lastRemoteCheck = Date.now()
	return list
}

DataList.prototype.backfillList = function(list, localEntry = false) {
	if(!this) throw "Invalid DataList call backfillList"
	if(!_.isArray(list)) throw "Invalid list backfill"
	const newMeta = calcMeta(list)
	this.setMeta(combineMetas(this.meta, newMeta))
	this.list = _.unionBy(list, this.list, 'id')
	this.lastRemoteLoad = localEntry ? this.lastRemoteLoad : Date.now()
	this.lastRemoteCheck = localEntry ? this.lastRemoteCheck : Date.now()
	return list
}

DataList.prototype.clear = function() {
	if(!this) throw "Invalid DataList call clear"
	this.list = []
	this.meta = defaultMeta()
	this.lastRemoteLoad = 0
	this.lastRemoteCheck = 0
	return true
}

DataList.prototype.get = function(id) {
	if(!this) throw "Invalid DataList call get"
	return this.list.find(o => o.id === id)
}

DataList.prototype.getMany = function(ids) {
	if(!this) throw "Invalid DataList call getMany"
	return this.list.filter(o => ids.includes(o.id))
}

DataList.prototype.dataCurrent = function() {
	if(!this) throw "Invalid DataList call dataCurrent"
	return Date.now() < this.lastRemoteCheck + this.remoteInterval * 1000
}

DataList.prototype.remoteCheck = function(force = false, simResponse) {
	if(!this) throw "Invalid DataList call remoteCheck"
	if(!force && this.dataCurrent()) return Promise.resolve(false)
	return updateModel(this.fieldName, '?filter=' + JSON.stringify({
		  	where: {
		  		or: [
		  			{
		  				id: {gt: this.getMeta().ids[1]},
		  				timestamp: {gt: moment(this.getMeta().timestamps[1]).format('YYYY-MM-DD HH:mm:ss')}
		  			}
		  		]
		  	}
		  }), undefined, simResponse)
		.then(() => getList(this.fieldName))
		.then((list) => this.replaceList(list))
		.then(() => true)
}

DataList.prototype.acquireListUpdate = function(queryString, url, simResponse) {
	if(!this) throw "Invalid DataList call acquireListUpdate"
	return updateModel(this.fieldName, queryString, url, simResponse)
		.then(() => getList(this.fieldName))
		.then((list) => this.replaceList(list))
		.then(() => true)
}

export default DataList