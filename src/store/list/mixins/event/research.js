// src/store/list/mixins/event/research.js

import _ from 'lodash'
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min'


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
				recents: messages.recentReviews({
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
				.map(d => {
					d.time = messages.subjectActivity({subjectType: ARTIST, subject: d.id})
						.map(m => moment(m.timestamp).valueOf())
						.sort((a, b) => b - a)
						.reduce((pv, cv) => pv || cv, 0)
					//console.log('ArtistData', d)
					return d
				})
				.sort((a, b) => {
					//sort by recency
					if(a.time - b.time) return b.time - a.time
					//sort by priority
					const aPriId = lineups.getPriFromArtistFest(a.id, id)
					const bPriId = lineups.getPriFromArtistFest(b.id, id)
					if(aPriId === bPriId) return a.name.localeCompare(b.name)
					const aPriLevel = artpris.getLevel(aPriId)
					const bPriLevel = artpris.getLevel(bPriId)
					return aPriLevel - bPriLevel
				})
	},
	reviewedArtistIds (id, author) {
		if(!id || !this.get(id) || !this.getEndMoment(id)) return []
		//console.log('reviewedArtistIds get', id, author, this.get(id))
		
		const lineupArtistIds = lineups.getFestivalArtistIds(id)
		const unreviewedIds = this.getResearchList(id, author).map(x => x.id)
		//console.log('reviewedArtistIds', id, author, lineupArtistIds)
		return lineupArtistIds
			.filter(id => id && !unreviewedIds.includes(id))
			//.filter(aid => console.log('reviewedArtistIds postfilter', aid) || aid)

	},
}}