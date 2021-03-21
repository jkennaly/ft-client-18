// src/store/list/mixins/event/sellAccess.js


import {subjectBought} from '../../../../services/authOptions/gtt'

export default (subList) => { return  {
	sellAccess (id, decoded) { 
		if(!this.subjectType) return false
		const so = {
			subjectType: this.subjectType,
			subject: id
		}
		const bought = subjectBought(so)(decoded)
		const endMoment = bought || this.getEndMoment(id)
		const nonsellable = bought || endMoment && endMoment.valueOf() < Date.now()
		//console.log(this.fieldName, 'sellAccess', nonsellable, id)
		if(!subList || !subList.sellAccess || nonsellable) return !nonsellable
		const subs = this.getSubIds(id)

			
		return subs
			.reduce((sellable, sid) => sellable && subList.sellAccess(sid, decoded) , true)
	}  
}}