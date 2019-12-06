// src/store/list/mixins/remote/batchDelete.js

import provide from '../../../loading/provide'

export default {
	batchDelete (data) { 
		const end = `/api/${this.fieldName}/batchDelete/`
			//console.log('batchDelete ' + this.fieldName)
			//console.log(data)
			return provide(data, this.fieldName, '', end)
				.then(() => this.remoteCheck(true))
	}  
}