// updateInstance.js

import provide from '../../../loading/provide'

export default {
	updateInstance (id, data) { 
		const end = `/api/${this.fieldName}/${id}`
			const currentEl = this.get(id)
			const newEl = _.assign({}, currentEl, data)
			//console.log('updateInstance ' + this.fieldName)
			//console.log(data)
			return provide(newEl, this.fieldName, '', end, 'PUT')
				.then(() => this.remoteCheck(true))
	}
}