// artistConnections.js

export default (artistPriorities) => { return  {
	peakArtistPriLevel (artist) {
		 return _.min(this.getFiltered(l => l.band === artist)
			.map(l => artistPriorities.getLevel(l.priority))
			.filter(l => l)
		)
}