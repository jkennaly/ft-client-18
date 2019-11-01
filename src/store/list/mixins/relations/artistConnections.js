// artistConnections.js
import _ from 'lodash'

export default (artistPriorities, artists, festivals) => { return  {
	peakArtistPriLevel (artist) {
		 return _.min(this.getFiltered(l => l.band === artist)
			.map(l => artistPriorities.getLevel(l.priority))
			.filter(l => l)
		)
		},
		getPriFromArtistFest(artist, fest) {
					const target = _.find(this.list, p => p.festival === fest && p.band === artist)
					if(!target) return
					return target.priority
				},
		getIdFromArtistFest (artist, fest) {
			//console.log('remoteData.lineups.getIdFromArtistFest')
			//console.log(artist)
			//console.log(fest)
			const target = _.find(this.list, p => p.festival === fest && p.band === artist)
			if(!target) return
			return target.id
		},
		getFromArtistFest (artist, fest) {return  _.find(this.list, p => p.festival === fest && p.band === artist)},
		artistLineups (artist) {return this.list
			.filter(p => p.band === artist)
		},
		peakArtistPriLevel (artist) {return _.min(this.artistLineups(artist)
			.map(l => artistPriorities.getLevel(l.priority))
			.filter(l => l))
		}, 
		festivalsForArtist (artist) {return _.uniq(this.artistLineups(artist)
			.map(p => p.festival))}, 
		artistInLineup (artist) { return _.some(this.list,
			p => p.band === artist)},
		artistInFestival (artist, fest) {return _.some(this.list,
			p => p.band === artist && p.festival === fest)},
		forFestival (fest) {return this.list.filter(l => l.festival === fest)},
		festHasLineup (fest) {return _.some(this.list, l => l.festival === fest)},
		getFestivalArtistIds (fest, lineupFilter = x => x ) {return this.list
			.filter(l => l.festival === fest)
			.filter(lineupFilter)
			.map(l => l.band)},
		getNotFestivalArtistIds (fest) {
			const excludeIds = this.getFestivalArtistIds(fest)
			return artists.list
				.filter(artist => excludeIds.indexOf(artist.id) < 0)
				.map(artist => artist.id)
		},
		//this returns lineups with unscheduled set
		getUnscheduledForFestival (festivalId) {return this.forFestival(festivalId)
			.filter(l => l.unscheduled)
		},
		//this returns festival objects for each festival where all 
		//artists have the same, default priority (i.e., headliners
		//need to be entered) from amongst a supplied group of ids
		//(or from all festivals if no ids supplied)
		allPrioritiesDefaultFestivals (festIds) {return (festIds.length ? festivals.getMany(festIds) : festivals.list)
			.filter(f => this.festHasLineup(f.id))
			.map(f => {
				//console.log('allPrioritiesDefaultFestivals')
				//console.log(f)
				return f
			})
			.filter(f => !this.forFestival(f.id)
				//find if at least two different priorities are used
				.reduce((found, lineup, i, arr) => {
				//console.log('allPrioritiesDefaultFestivals')
				//console.log(found)
				//console.log(lineup)
					//multiple pris found alreadt (found === true)
					//or 1 pri found already and it is differnet than the current pri
					if(found === true || found && lineup.priority && lineup.priority !== found) {
						return true
					} 
					//special case if this the last iteration return false
					else if(i + 1 === arr.length) {
						return false
					}
					//one or both are not valid or not unique, so return the good one and keep looking
					return found ? found : lineup.priority
				}, 0)
			)},
	}
}