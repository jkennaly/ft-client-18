// setName.js

export default (artists) => { return  {
	getArtistId (id) {
		//console.log('remoteData.Sets.getArtistId ' + id)
		//console.log('remoteData.Sets.list ' + remoteData.Sets.list.length)
		const set = this.get(id)
		if(!set) return
		return set.band
	},
	getArtistName (id) {
		//console.log('remoteData.Sets.getArtistName ' + id)
		return artists.getName(this.getArtistId(id))
		
	},
	getEventName (id) { 
		const superNames = this.getEventNameArray(id)
		return `${this.getArtistName(id)}: ${superNames[0]} ${superNames[1]}`
	}  
}}