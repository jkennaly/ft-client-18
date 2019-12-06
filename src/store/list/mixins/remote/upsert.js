// src/store/list/mixins/remote/upsert.js

import provide from '../../../loading/provide'

export default {
	upsert (data) { 
		const end = `/api/${this.fieldName}/`
			//console.log('upsert ' + this.fieldName)
			//console.log(data)
			return provide(data, this.fieldName, '', end, 'PUT')
				//.then(el => console.log('upsert', end, el) && el || el)
				.then(responseEl => this.backfillList([responseEl], true))
	}
}