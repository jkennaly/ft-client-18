// batchCreate.js

import provide from '../../../loading/provide'

export default {
	batchCreate (data) { 
		const end = `/api/${this.fieldName}/batchCreate/`
			//console.log('batchCreate ' + this.fieldName)
			//console.log(data)
			return provide(data, this.fieldName, '', end)
				.then(() => this.remoteCheck(true))
	}  
}