// DataList.js


import _ from 'lodash'
import m from 'mithril'
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min'


import {unionLocalList, calcMeta, defaultMeta, combineMetas, metaQuivalent} from '../../services/localData.js'
import {updateModel, coreChecked} from '../loading/acquire'
import provide from '../loading/provide'
import archive from '../loading/archive'
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

DataList.prototype.clearCaches = function(cacheOnly) {
	if(!this) throw new Error("Invalid DataList call clearCache")
	if(!cacheOnly) this.lastRemoteLoad = 0
	if(!cacheOnly) this.lastRemoteCheck = 0
	Object.keys(this)
		.filter(k => /^_cache_clear/.test(k))
		.forEach(k => this[k]())

	return true
}

DataList.prototype.setMeta = function(meta) {
	if(!this) throw new Error("Invalid DataList call setMeta")
	this.clearCaches(true)
	return this.meta = _.clone(meta)
}

DataList.prototype.getMeta = function() {
	if(!this) throw new Error("Invalid DataList call setMeta")
		//console.log('getMeta', this.meta, this.list.length)
	return _.clone(this.meta)
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

DataList.prototype.replaceList = function(data) {
	if(!this) throw new Error("Invalid DataList call replaceList")
	const list = _.isArray(data) ? data : []
	const newMeta = calcMeta(list)
	const dataChange = list.some(li => {
		if(!li) return false
		const cv = this.get(li.id)
		const alreadyDeleted = li.deleted && !cv
		const same = alreadyDeleted || _.eq(cv, li)
		//console.log('replaceList li', li, cv, alreadyDeleted, same)
		return !same
	}) || this.list.some(li => {
		if(!li) return false
		const cv = list.find(l => l.id === li.id)
		const same =  _.eq(cv, li)
		//console.log('replaceList li', li, cv, alreadyDeleted, same)
		return !same
	})
	this.lastRemoteLoad = Date.now()
	this.lastRemoteCheck = Date.now()
	if(!dataChange) return list


	this.setMeta(newMeta)
	this.list = _.clone(list).filter(m => !m.deleted)
	m.redraw()
	return list
}

DataList.prototype.backfilling = function() {
	var baseline = Promise.resolve(true)
	return promise => {
		if (!promise) return baseline
		baseline = promise
	}
}()

DataList.prototype.backfillList = function(list, localEntry  = false) {
	if(!this) throw new Error("Invalid DataList call backfillList")
	if(!_.isArray(list)) throw new Error("Invalid list backfill")
	const changed = li => {
		if(!li) return false
		const cv = this.get(li.id)
		//console.log('backfillList changed', li, cv)
		const same = cv && _.eq(cv, li)
		return !same
	}
	const backfillQ = this.backfilling()
		.then(() => {
			//console.log('backfillList new, old', list.map(x => x.id), this.list.map(x => x.id))
			const dataChange = list.some(changed)
			this.lastRemoteLoad = localEntry ? this.lastRemoteLoad : Date.now()
			this.lastRemoteCheck = localEntry ? this.lastRemoteCheck : Date.now()
			if(!dataChange) return list
			this.list = _.unionBy(list.filter(changed), this.list, 'id').filter(m => !m.deleted)
			this.setMeta(calcMeta(this.list))
			return list
		})
		.then(list => {
			m.redraw()
			return list
		})
		.catch(err => console.log(err))
	this.backfilling(backfillQ)
	return backfillQ
}

DataList.prototype.clear = function() {
	if(!this) throw new Error("Invalid DataList call clear")
	//console.log('DataList clear', this.fieldName)
	this.list = []
	this.meta = defaultMeta()
	//find all cache properties and kill them
	this.clearCaches()

	return true
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
		//console.log('acquireListUpdate fieldName, queryString, url', this.fieldName, queryString, url)
	return updateModel(this.fieldName, queryString, url, simResponse)
		.then(([upd, newData]) => {
			if(_.isArray(newData)) this.replaceList(newData)
			return upd
		})
}

var supCache = {}
var supCachePromises = {}

DataList.prototype.acquireListSupplement = function(queryString, url, simResponse) {
	//console.log('acquireListSupplement fieldName, queryString, url', this.fieldName, queryString, url)
	if(!this) throw new Error("Invalid DataList call acquireListSupplement")
		//check if we have run this query before and the cahce is still good
	const key = `${this.fieldName}.${queryString}.${url}`
	const maxAge = this.remoteInterval * 1000
	const cacheGood = _.get(supCache, key, 0) + maxAge > Date.now()
	if(cacheGood) return _.get(supCachePromises, key, false)
	_.set(supCache, key, Date.now())
		var updated = false
	//console.log('acquireListSupplement fieldName, queryString, url', this.fieldName, queryString, url)
	const updPromise = updateModel(this.fieldName, queryString, url, simResponse)
	/*
		.then(upd => {
			if(upd) m.redraw()
			return upd
		})
		.then(upd => {
			console.log(this.fieldName, 'acquireListSupplement', upd, this.list, queryString, url)
			return upd
		})
		*/
		.then(([upd, newData]) => {
			if(_.isArray(newData)) this.backfillList(newData)
			return upd
		})
		
	_.set(supCachePromises, key, updPromise)
	return updPromise
}
DataList.prototype.lbfilter = function(filter) { 
	const end = `/api/${this.fieldName}?filter=${JSON.stringify(filter)}`
	//console.log('lbfilter ' + this.fieldName)
	//console.log(data)
	return provide(undefined, this.fieldName, '', end, 'GET')

} 
DataList.prototype.maintainList = function(filterObject) {
	if(!this) throw new Error("Invalid DataList call maintainList")
	return this.acquireListSupplement(`filter=${JSON.stringify(filterObject)}`)
		/*
	const listIdsPresent = this.loopFiltered(filterObject).map(x => x.id)
	const andObject = {id: {nin: listIdsPresent}}
	const filterHasWhere = _.isObject(filterObject.where)
	const filterHasWhereAnd = filterHasWhere && _.isArray(filterObject.where.and)
	let finalFilter
	if(filterHasWhereAnd) {
		let next = _.cloneDeep(filterObject)
		next.where.and.push(andObject)
		finalFilter = next
	} else if(filterHasWhere) {
		let next = _.cloneDeep(filterObject)
		const oldWhere = next.where
		next.where = {and: []}
		next.where.and.push(oldWhere)
		next.where.and.push(andObject)
		finalFilter = next

	} else {
		let next = _.cloneDeep(filterObject)
		next.where = andObject
		finalFilter = next

	}
	*/
}

export default DataList