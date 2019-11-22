// messageName.js
import _ from 'lodash'

import {subjectDataField} from '../../../../services/subjectFunctions'

const baseMessage = (subjectType, ar) => me => {
	if(!me || !me.id || !me.subject || !me.subjectType) return undefined
	if(me.subjectType !== subjectType) return me
	return baseMessage(ar.find(el => el.id === me.subject))
}
export default (subjects) => { return  {
	getName (id) { 
		const v = this.get(id)
			if(!v || !v.content) return ''
			//fromuser to touser re:subjectName
			const fromField = subjects.profiles.getName(v.fromuser)
			const toField = v.touser ? ' to ' + subjects.profiles.getName(v.touser) : ''
			//console.log('Messages getName', v, subjectDataField(v.subjectType))
			const subjectName = ' re: ' + subjects[subjectDataField(v.subjectType).toLowerCase()].getName(v.subject).replace(/^ re: /, '')
			return _.truncate(subjectName)
	},
	getDescendants (so) {
		const bases = this.getFiltered(so)
		const baseIds = bases.map(x => x.id)
		const b = baseMessage(this.subjectType, this.list)
		return this
			.getFiltered(m => b(m))
			.filter(m => baseIds.includes(b(m).id))
	}
}}