// src/store/list/mixins/remote/buy.js

import _ from 'lodash'

import provide from '../../../loading/provide'

var buyInProgress = false
export default {
	buy (buyObject) { 
		const end = `/api/${this.fieldName}/buy`
		const p = provide(buyObject, this.fieldName, '', end, 'POST')
			.catch(console.log)
			.then(c => {console.log('buy response', c); return c})
		
		return p
	}
}