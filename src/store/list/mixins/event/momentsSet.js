// src/store/list/mixins/event/momentsSet.js
export default (days) => { return  {
	getStartMoment (id) {
		const set = this.get(id)
		if(!set) throw new Error('set.getBaseMoment nonexistent set ' + id)
		const superDay = this.getSuperId(id)
		//console.log('set.getStartMoment', id, superDay)
		const superMoment = days.getBaseMoment(superDay)
		return superMoment.add(this.get(id).start, 'minutes')
		},
	getEndMoment (id) {
		const superMoment = days.getBaseMoment(this.getSuperId(id))
		return superMoment.add(this.get(id).end, 'minutes')
	},
	getSetTimeText (id)  {
		//console.log('this.getSetTimeText ' + id)
		const startMoment = this.getStartMoment(id)
		const endMoment = this.getEndMoment(id)
		return startMoment.format('h:mm') + ' ' + endMoment.format('h:mm')
	},
	getTimeString (id) {
		try {
		return this.getSetTimeText(id) 
	}
		catch {
			return ''
		}
	}

}}