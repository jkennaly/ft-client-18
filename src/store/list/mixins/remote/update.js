// update.js

import provide from '../../../loading/provide'

export default {
	update (data, id, simResponse) { 
		const end = `/api/${this.fieldName}/update?where={"id":${id}}`
			//console.log('update artists')
			//console.log(data)
			return provide(data, this.fieldName, '', end, 'POST', simResponse)
				.then(() => simResponse || this.remoteCheck(true))
				.then(!simResponse ? x => x : () => end)
	}  
}