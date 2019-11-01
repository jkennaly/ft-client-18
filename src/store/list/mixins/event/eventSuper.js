// eventSuper.js
import _ from 'lodash'

export default (superList) => { return  {
	getSuperId (id) { 
		//console.log('eventSuper ', this, superList.idField, id, this.get(id))
		return _.get(this.get(id), superList.idField)
	},
	getSuperEventNameArray (id) {
		return superList.getEventNameArray(this.getSuperId(id))
	}
}}