// named.js

export default {
	getName (id) { 
		return _.get(this.get(id), 'name')
	}  
}