// virginal.js

export default (messages, festivals, lineups) => { return  {
	virgins () {
		const futures = festivals.future()
					
			return this.list
				.filter(ar => !messages.getFiltered({subjectType: 2, subject: ar.id}).length)
				.sort((a, b) => {
					//primary: in a lineup for a festival in the future
					const aFuture = _.some(futures, f => lineups.getFiltered({band: a.id, festival: f.id}).length)
					const bFuture = _.some(futures, f => lineups.getFiltered({band: b.id, festival: f.id}).length)
					const usePrimary = aFuture ? !bFuture : bFuture
					if(usePrimary && aFuture) return -1
					if(usePrimary && bFuture) return 1
					//secondary: peak priority level
					const al = lineups.peakArtistPriLevel(a.id)
					const bl = lineups.peakArtistPriLevel(b.id)
					return al -bl
				})
	}}  
}