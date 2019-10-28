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
	this.queryStrings = {
		  since: () => '?filter=' + JSON.stringify({
		  	where: {
		  		or: [
		  			{
		  				id: {gt: this.meta.ids[1]},
		  				timestamp: {gt: moment(this.meta.timestamps[1]).format('YYYY-MM-DD HH:mm:ss')}
		  			}
		  		]
		  	}
		  })
	}



}

DataList.prototype.setMeta = function(meta) {
	return this.meta = _.clone(meta)
}

DataList.prototype.replaceList = function(list) {
	if(!_.isArray(list)) throw "Invalid list replacement"
	this.setMeta(calcMeta(list))
	this.list = _.clone(list)
	this.lastRemoteLoad = Date.now()
	this.lastRemoteCheck = Date.now()
	return list
}

DataList.prototype.backfillList = function(list, localEntry = false) {
	if(!_.isArray(list)) throw "Invalid list backfill"
	const newMeta = calcMeta(list)
	this.setMeta(combineMetas(this.meta, newMeta))
	this.list = _.unionBy(list, this.list, 'id')
	this.lastRemoteLoad = localEntry ? this.lastRemoteLoad : Date.now()
	this.lastRemoteCheck = localEntry ? this.lastRemoteCheck : Date.now()
	return list
}

DataList.prototype.clear = function() {
	this.list = []
	this.meta = defaultMeta()
	this.lastRemoteLoad = 0
	this.lastRemoteCheck = 0
	return true
}

DataList.prototype.get = function(id) {
	return this.list.find(o => o.id === id)
}

DataList.prototype.getMany = function(ids) {
	return this.list.filter(o => ids.includes(o.id))
}

DataList.prototype.dataCurrent = function() {
	return Date.now() < this.lastRemoteCheck + this.remoteInterval * 1000
}

DataList.prototype.remoteCheck = function(force = false) {
	if(!force && this.dataCurrent()) return Promise.resolve(false)
	return updateModel(this.fieldName, this.queryStrings.since())
		.then(() => getList(this.fieldName))
		.then(this.replaceList)
		.then(() => true)

}

DataList.prototype.acquireListUpdate = function() {
	return updateModel(arguments)
		.then(() => getList(this.fieldName))
		.then(this.replaceList)
		.then(() => true)

}

export default DataList