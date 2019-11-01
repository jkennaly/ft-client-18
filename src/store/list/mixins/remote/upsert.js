// upsert.js

import provide from '../../../loading/provide'

export default {
	upsert (data) { 
		const end = `/api/${this.fieldName}/`
			//console.log('upsert ' + this.fieldName)
			//console.log(data)
			return provide(data, this.fieldName, '', end, 'PUT')
				.then(() => this.remoteCheck(true))
	}
}