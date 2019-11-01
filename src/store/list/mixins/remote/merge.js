// merge.js

import provide from '../../../loading/provide'

export default {
	merge (id1, id2, simResponse) { 
		const end = `/api/${this.fieldName}/admin/merge/${id1}/${id2}`
		//console.log('merge artists')
		//console.log(data)
		return provide({}, this.fieldName, '', end, 'POST', simResponse)
			.then(() => simResponse || this.remoteCheck(true))
			.then(!simResponse ? x => x : () => end)
	}  
}