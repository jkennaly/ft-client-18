// leveled.js

export default {
	getLevel (id) { 
		return _.get(this.get(id), 'level')
	}  
}