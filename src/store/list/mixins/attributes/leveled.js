// leveled.js
import _ from 'lodash'

export default {
	getLevel (id) { 
		return _.get(this.get(id), 'level')
	}  
}