// research.js

import _ from 'lodash'

export default (artists, messages, lineups, artpris) => { return  {
	getResearchList (id, author) { 
		const artistData = artists.getMany(lineups.getFestivalArtistIds(id))
			const artistIds = artistData
				.map(a => a.id)
			const researchObject = {
				forces: messages.forced({
					artistIds: artistIds,
					festivalId: id
				}),
				skips: messages.skipped({
					artistIds: artistIds,
					festivalId: id
				}),
				saves: messages.saved({
					artistIds: artistIds,
					festivalId: id
				}),
				hides: messages.hidden({
					artistIds: artistIds,
					festivalId: id
				}),
				recents: messages.recentRatings({
					artistIds: artistIds,
					author: author
				})
			}
			//console.log('remoteData.Festivals.getResearchList ' + id + ' ' + author)
			//console.log('remoteData.Festivals.getResearchList recents', researchObject.recents)
			return artistData
				.filter(a => {
					//in
					const forced = _.includes(researchObject.forces, a.id)
					//out
					const recent = !forced && _.includes(researchObject.recents, a.id)
					const skipped = !forced && !recent && _.includes(researchObject.skips, a.id)
					const saved = !forced && !recent && !skipped && _.includes(researchObject.saves, a.id)
					const hidden = !forced && !recent && !skipped && !saved && _.includes(researchObject.hides, a.id)
					return forced || !recent && !skipped && !saved && !hidden
				})
				.sort((a, b) => {
					const aPriId = lineups.getPriFromArtistFest(a.id, id)
					const bPriId = lineups.getPriFromArtistFest(b.id, id)
					if(aPriId === bPriId) return a.name.localeCompare(b.name)
					const aPriLevel = artpris.getLevel(aPriId)
					const bPriLevel = artpris.getLevel(bPriId)
					return aPriLevel - bPriLevel
				})
}}}