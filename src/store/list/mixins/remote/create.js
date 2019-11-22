// create.js

import _ from 'lodash'

import provide from '../../../loading/provide'

export default {
	create (data) { 
		const end = `/api/${this.fieldName}/`
			//console.log('create ' + this.fieldName)
			//console.log(data)
			return provide(data, this.fieldName, '', end)
				.then(created => {this.backfillList(_.isArray(created) ? created : [created]); return created})

	}  
}