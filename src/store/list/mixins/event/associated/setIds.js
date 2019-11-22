// dayIds.js

export default ({series, festivals, dates, days, artists}) => { return  {
	getSeriesId (id) { 
		if(!this.getDayId(id)) return
		return festivals.getSeriesId(dates.getFestivalId(days.getDateId(this.getDayId(id))))
	},
	getFestivalId (id) {
		if(!this.getDayId(id)) return
		return dates.getFestivalId(days.getDateId(this.getDayId(id)))
		},
	getDateId (id) {
		if(!this.getDayId(id)) return
		return days.getDateId(this.getDayId(id))
	},
	getDayId (id) {
		const set = this.get(id)
			if(!set) return
			return set.day
	},
	getPeerIds (id) {
		return days.getSubIds(this.getSuperId(id))
			.filter(x => x !== id)
	},
	getArtistId (id) {
		//console.log('this.getArtistId ' + id)
		//console.log('this.list ' + this.list.length)
		const set = this.get(id)
		if(!set) return
		return set.band
	},
	getArtistName (id) {
		//console.log('this.getArtistName ' + id)
		return artists.getName(this.getArtistId(id))
		
	},
}}