// batchUpdate.js

import provide from '../../../loading/provide'

export default {
	batchUpdate (data) { 
		const end = `/api/${this.fieldName}/batchUpdate/`
			//console.log('batchUpdate ' + this.fieldName)
			//console.log(data)
			return provide(data, this.fieldName, '', end)
				.then(() => this.remoteCheck(true))
	}  
}