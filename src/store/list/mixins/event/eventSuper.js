// eventSuper.js

export default (superList) => { return  {
	getSuperId (id) { 
		return _.get(this.get(id), superList.idField)
	},
	getSuperEventNameArray (id) {
		return superList.getEventNameArray(this.getSuperId(id))
	}
}}