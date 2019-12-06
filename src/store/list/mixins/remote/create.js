// src/store/list/mixins/remote/create.js

import _ from 'lodash'

import provide from '../../../loading/provide'

export default {
	create (data) { 
		const end = `/api/${this.fieldName}/`
			//console.log('create ' + this.fieldName)
			//console.log(data)
			return provide(data, this.fieldName, '', end)
				//.then(c => {console.log('create response', c); return c})
				.then(created => {this.backfillList(_.isArray(created) ? created : [created]); return created})

	}  
}