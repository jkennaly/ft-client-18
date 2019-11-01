// deletion.js

import provide from '../../../loading/provide'

export default {
	delete (data) { 
		const end = `/api/${this.fieldName}/${data.id}`
			//console.log('delete ' + this.fieldName)
			//console.log(data)
			return provide(data, this.fieldName, '', end, 'DELETE')
				.then(() => this.remoteCheck(true))
	}
}