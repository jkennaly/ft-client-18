// DataList.js


import _ from 'lodash'
import m from 'mithril'
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min'

import {unionLocalList, calcMeta, defaultMeta, combineMetas, metaQuivalent} from '../../services/localData.js'
import {updateModel, coreChecked} from '../loading/acquire'
import {getList} from '../loading/enlist'
//A DataList object contains the minimum to interact with the festivaltime api

function DataList(opt = {}) {
	if(!opt.fieldName) throw new Error("Invalid list fieldName")
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
	if(!this) throw new Error("Invalid DataList call setMeta")
	return this.meta = _.clone(meta)
}

DataList.prototype.getMeta = function() {
	if(!this) throw new Error("Invalid DataList call setMeta")
		//console.log('getMeta', this.meta, this.list.length)
	return _.clone(this.meta)
}

DataList.prototype.replaceList = function(data) {
	if(!this) throw new Error("Invalid DataList call replaceList")
	const list = _.isArray(data) ? data : []
	this.setMeta(calcMeta(list))
	this.list = _.clone(list).filter(m => !m.deleted)
	this.lastRemoteLoad = Date.now()
	this.lastRemoteCheck = Date.now()
	m.redraw()
	return list
}

DataList.prototype.backfillList = function(list, localEntry = false) {
	if(!this) throw new Error("Invalid DataList call backfillList")
	if(!_.isArray(list)) throw new Error("Invalid list backfill")
	this.list = _.unionBy(list, this.list, 'id').filter(m => !m.deleted)
	this.setMeta(calcMeta(this.list))
	this.lastRemoteLoad = localEntry ? this.lastRemoteLoad : Date.now()
	this.lastRemoteCheck = localEntry ? this.lastRemoteCheck : Date.now()
	m.redraw()
	return list
}

DataList.prototype.clear = function() {
	if(!this) throw new Error("Invalid DataList call clear")
	this.list = []
	this.meta = defaultMeta()
	this.lastRemoteLoad = 0
	this.lastRemoteCheck = 0
	return true
}

DataList.prototype.get = function(id) {
	if(!this) throw new Error("Invalid DataList call get")
	return this.list.find(o => o.id === parseInt(id, 10))
}

DataList.prototype.getMany = function(ids) {
	if(!this) throw new Error("Invalid DataList call getMany")
	if(!_.isArray(ids)) throw new Error(`Invalid ids ${ids} supplied to getMany for ${this.fieldName}`)
	return this.list.filter(o => ids.includes(o.id))
}

DataList.prototype.dataCurrent = function() {
	if(!this) throw new Error("Invalid DataList call dataCurrent")
	return Date.now() < this.lastRemoteCheck + this.remoteInterval * 1000
}

DataList.prototype.remoteCheck = function(force = false, simResponse) {
	//console.log('remoteCheck', this.fieldName, force, this.dataCurrent())
	if(!this) throw new Error("Invalid DataList call remoteCheck")
	if(!force && this.dataCurrent()) return Promise.resolve(false)
	let updated = false
	return coreChecked
		//.then(() => console.log('coreCheck complete', this.fieldName, this.getMeta()))

		.then(() => updateModel(this.fieldName, 'filter=' + JSON.stringify({
		  	where: {
		  		or: [
		  			
		  				{id: {gt: this.getMeta().ids[1]}},
		  				{timestamp: {gt: moment(this.getMeta().timestamps[1]).milliseconds(0).toISOString().replace(/\.\d+Z/,'Z')}}
		  			
		  		]
		  	}
		  }), undefined, simResponse))
		.then(() => getList(this.fieldName))
		.then((list) => this.replaceList(list))
		.then(() => true)
}

DataList.prototype.acquireListUpdate = function(queryString, url, simResponse) {
	if(!this) throw new Error("Invalid DataList call acquireListUpdate")
		var updated = false
		//console.log('acquireListUpdate fieldName, queryString, url', this.fieldName, queryString, url)
	return updateModel(this.fieldName, queryString, url, simResponse)
		.then((upd) => {if(updated = upd) return getList(this.fieldName);})
		.then((list) => {if(_.isArray(list)) this.replaceList(list);})
		.then(() => updated)
}

export default DataList