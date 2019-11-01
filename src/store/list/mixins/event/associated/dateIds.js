// dateIds.js

export default ({series, festivals, days, sets}) => { return  {
	getSeriesId (id) { 
		return festivals.getSeriesId(this.getFestivalId(id))
	},
	getFestivalId: (id) => {
		const date = this.get(id)
			if(!date) return
			return date.festival
	},
	getSubDayIds (id) {
		return days.list.filter(s => s.date === id).map(s => s.id)
	},
	getSubSetIds (id) {
		const days = this.getSubDayIds(id)
			return sets.list.filter(s => days.indexOf(s.day) > -1).map(s => s.id)
	},
	getPeerIds (id) {
		return festivals.getSubIds(this.getSuperId(id))
			.filter(x => x !== id)
	},
	getLineupArtistIds (id) {
		const festivalId = this.getFestivalId(id)
			if(!festivalId) return
			return remoteData.Lineups.getFestivalArtistIds(festivalId)
	}
}}