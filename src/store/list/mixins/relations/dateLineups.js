// dateLineups.js

export default (lineups) => { return  {
	getLineupArtistIds (id) {
		const festivalId = this.getFestivalId(id)
			if(!festivalId) return
			return lineups.getFestivalArtistIds(festivalId)
	}
}}