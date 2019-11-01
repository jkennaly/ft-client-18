// create.js

import provide from '../../../loading/provide'

export default {
	create (data) { 
		const end = `/api/${this.fieldName}/`
			//console.log('create ' + this.fieldName)
			//console.log(data)
			return provide(data, this.fieldName, '', end)
				.then(() => this.list.push(data))
				.then(() => this.remoteCheck(true))
				.then(() => this.getFiltered(data))
	}  
}