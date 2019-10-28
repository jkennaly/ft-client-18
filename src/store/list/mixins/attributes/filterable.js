// filterable.js
import _ from 'lodash'

export default {
	getFiltered (filter) { 
		return _.filter(this.list, filter)
	}  
}