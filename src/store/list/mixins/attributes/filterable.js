// filterable.js
import _ from 'lodash'

export default {
	getFiltered (filter) { 
		return _.filter(this.list, filter)
	},
	find (filter) { 
		return _.find(this.list, filter)
	},
	some (filter) { 
		return _.some(this.list, filter)
	}
}