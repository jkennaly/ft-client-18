// dayIds.js

export default ({series, festivals, dates, days, artists}) => { return  {
	getSeriesId (id) { 
		return festivals.getSeriesId(dates.getFestivalId(days.getDateId(remoteData.Sets.getDayId(id))))
	},
	getFestivalId (id) {
		return dates.getFestivalId(days.getDateId(remoteData.Sets.getDayId(id)))
		},
	getDateId (id) {
		return days.getDateId(remoteData.Sets.getDayId(id))
	},
	getDayId (id) {
		const set = remoteData.Sets.get(id)
			if(!set) return
			return set.day
	},
	getPeerIds (id) {
		return days.getSubIds(this.getSuperId(id))
			.filter(x => x !== id)
	},
	getArtistId: id => {
		//console.log('remoteData.Sets.getArtistId ' + id)
		//console.log('remoteData.Sets.list ' + remoteData.Sets.list.length)
		const set = remoteData.Sets.get(id)
		if(!set) return
		return set.band
	},
	getArtistName: id => {
		//console.log('remoteData.Sets.getArtistName ' + id)
		return artists.getName(remoteData.Sets.getArtistId(id))
		
	},
}}