// place.js
import _ from 'lodash'

export default (series, festivals) => { return  {
	getFestivalId (id)  {
		const place = this.get(id)
		if(!place) return
		return place.festival
	},
	forFestival (festivalId) {return _.uniqBy(this.list
		.filter(d => d.festival === festivalId), x => x.name)
		.sort((a, b) => a.priority - b.priority)
	},
	forSeries (seriesId) {return _.uniqBy(_.flatMap(
		series.getSubIds(seriesId),
		this.forFestival
	), x => x.name)
	},
	prevPlaces (festivalId) {return this.forFestival(
		_.max(festivals.getPeerIds(festivalId))
	)},
	missingStageFestivals (daysAhead = 14) {return festivals.future(daysAhead)
		.filter(festival => !this.forFestival(festival.id).length)
	}

}}