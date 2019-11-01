// dayIds.js

export default ({series, festivals, dates, sets}) => { return  {
	getSeriesId (id) { 
		return festivals.getSeriesId(dates.getFestivalId(this.getDateId(id)))
	},
	getFestivalId: (id) => {
		return dates.getFestivalId(this.getDateId(id))
	},
	getDateId (id) {
		const day = this.get(id)
			//console.log('this.getDateId', id, day)
			//console.log('this.getDateId list length', this.list.length)
			if(!day) return
			return day.date
	},
	getSubSetIds (id) {
		return sets.list.filter(s => s.day === id).map(s => s.id)
	},
	getPeerIds (id) {
		return dates.getSubIds(this.getSuperId(id))
			.filter(x => x !== id)
	}
}}