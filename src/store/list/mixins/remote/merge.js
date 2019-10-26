// merge.js

import provide from '../../loading/provide'

export default {
	merge (id1, id2) { 
		const end = `/api/${this.fieldName}/admin/merge/${id1}/${id2}`
		//console.log('merge artists')
		//console.log(data)
		return provide({}, this.fieldName, '', end)
			.then(() => this.remoteCheck(true))
	}  
}