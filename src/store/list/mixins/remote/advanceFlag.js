// src/store/list/mixins/remote/advanceFlag.js

import _ from 'lodash'

import provide from '../../../loading/provide'

export default {
	advance (data, id) { 
		const end = `/api/${this.fieldName}/advance/${id}`
			//console.log('advanceFlag ' + this.fieldName)
			//console.log(data)
			return provide({msg: data}, this.fieldName, '', end, 'POST')
				.then(responseEl => this.backfillList([responseEl.data ? responseEl.data : responseEl], true))
	}
}