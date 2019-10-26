// filterable.js

export default {
	getFiltered (filter) { 
		return _.filter(this.list, filter)
	}  
}