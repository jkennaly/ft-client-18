// setFilters.js

export default (dates, festivals, lineups) => { return  {
	datedLinedFestivals: (daysAhead = 14) => dates.upcomingDatedFestivals(daysAhead)
			//that have a lineup
			.filter(festival => lineups.festHasLineup(festival.id)),

			//find festivals that have a date
		unscheduledLineupFestivals: (daysAhead = 14) => this
			.datedLinedFestivals(daysAhead)
			//and at least one artist in lineup that does not have a set with a start time
			.filter(festival => {
				const festivalSetIds = festivals.getSubSetIds(festival.id)
				const festivalSets = this.getMany(festivalSetIds)
				const scheduledSets = festivalSets.filter(s => s.start)

				return _.some(
					lineups.getFestivalArtistIds(festival.id),
					artistId => !_.some(scheduledSets, s => s.band === artistId)
			)})
		,
		artistMissingDayFestivals: (daysAhead = 14) => this
			.datedLinedFestivals(daysAhead)
			//and at least one artist in lineup that does not have a set with a start time
			.filter(festival => {
				const festivalSetIds = festivals.getSubSetIds(festival.id)
				const festivalSets = this.getMany(festivalSetIds)
				const daySets = festivalSets.filter(s => s.day)
				const artistIds = lineups.getFestivalArtistIds(festival.id, l => !l.unscheduled)
				if(false && festival.id === 68) {
				console.log('artistMissingDayFestivals')
				console.log(daySets)
				console.log(artistIds)

				}

				return _.some(
					artistIds,
					artistId => !_.some(daySets, s => s.band === artistId)
				)
			})
		,
		artistMissingStageFestivals: (daysAhead = 14) => this
			.datedLinedFestivals(daysAhead)
			//and at least one artist in lineup that does not have a set with a start time
			.filter(festival => {
				const festivalSetIds = festivals.getSubSetIds(festival.id)
				const festivalSets = this.getMany(festivalSetIds)
				const stageSets = festivalSets.filter(s => s.stage)

				return _.some(
					lineups.getFestivalArtistIds(festival.id, l => !l.unscheduled),
					artistId => !_.some(stageSets, s => s.band === artistId)
				)
			})
}}