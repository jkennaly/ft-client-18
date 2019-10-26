// update.js

import provide from '../../loading/provide'

export default {
	update (data, id) { 
		const end = `/api/${this.fieldName}/update?where={"id":${id}}`
			//console.log('update artists')
			//console.log(data)
			return provide(data, this.fieldName, '', end)
				.then(() => this.remoteCheck(true))
	}  
}