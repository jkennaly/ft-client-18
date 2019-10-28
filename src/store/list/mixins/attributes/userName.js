// userName.js
import _ from 'lodash'

export default {
	getName (id) { 
		return _.get(this.get(id), 'username')
	}  
}