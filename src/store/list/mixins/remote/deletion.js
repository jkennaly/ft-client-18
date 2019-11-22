// deletion.js

import provide from '../../../loading/provide'
import _ from 'lodash'

export default {
	delete (data) { 
		const end = `/api/${this.fieldName}/${data.id}`
		//console.log('delete ' + this.fieldName)
		//console.log(data, _.assign({}, data, {deleted: 1}))
		return provide(data, this.fieldName, '', end, 'DELETE')
			.then(el => console.log('delete', end, el, _.assign({}, data, {deleted: 1})) && el || el)
			.then(() => this.backfillList([_.assign({}, data, {deleted: 1})], true))
			.catch(console.error)

	}
}