// src/store/list/mixins/remote/getPromise.js



import m from 'mithril'
import _ from 'lodash'
export default {
	getPromise (id) {
		if(!id) {
			return Promise.reject('No id for getPromise ' + this.fieldName)
		}

		//get subjectData from the model, loading from the server if needed
		//const get = this.get(id)
		//if(get) return Promise.resolve(get)
		const end = `/api/${this.fieldName}/${id}`
		//for each subject Type, collect detail information

		return this.acquireListSupplement(`filter=${JSON.stringify({where: {id: id}})}`)
		/*
			.then(upd => {
				if(!this.secDataPromise) return upd
				return this.secDataPromise()
					.then(upd2 => upd && upd2)
			})
			.catch(err => {
				console.error(err)
				return false
			})
			*/
			.then(upd => {
				const get = this.get(id)
				if(!get && !upd && this.fieldName !== 'Profiles') throw new Error(`no instance found ${this.fieldName} id:${id} ${typeof id}`)
				//if(!get && this.fieldName !== 'Profiles') throw new Error(`no instance loaded ${this.fieldName} id:${id} ${typeof id} first:`, this.list[0])
				return get ? get : {}
			})
			.catch(err => {
				console.error(err)
				m.route.set('/launcher')
			})

	},
	getLocalPromise (id) {
		if(!id) {
			return Promise.reject('No id for getPromise ' + this.fieldName)
		}

		//get subjectData from the model, loading from the server if needed
		//const get = this.get(id)
		//if(get) return Promise.resolve(get)
		const end = `/api/${this.fieldName}/${id}`
		//for each subject Type, collect detail information
		const current = this.get(id)
		if(current) return Promise.resolve(current)

		return this.getPromise(id)

	},
	getManyPromise (ids) {
		if(!_.isArray(ids)) {
			return Promise.reject('No ids for getManyPromise ' + this.fieldName)
		}

		//get subjectData from the model, loading from the server if needed
		const get = this.getMany(ids)
		const getComplete = _.every(ids, id => _.some(get, got => got.id === id))
		if(getComplete) return Promise.resolve(get)
		const missingIds = ids.filter(id => !_.some(get, got => got.id === id))


		const end = `/api/${this.fieldName}`
		const idsQuery = `filter=` + JSON.stringify({where: {
			id: {inq: missingIds}
		}})
		//for each subject Type, collect detail information

		return this.acquireListUpdate(idsQuery, end)
			.then(upd => {
				if(!this.secDataPromise) return upd
				return this.secDataPromise()
					.then(upd2 => upd && upd2)
			})
			.then(upd => {
				const get = this.getMany(ids)
				return get
			})
			.catch(err => {
				console.error(err)
				m.route.set('/launcher')
			})

	}
}