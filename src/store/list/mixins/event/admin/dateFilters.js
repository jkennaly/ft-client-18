// dateFilters.js

export default (festivals) => { return  {
	datedFestivals ()  {
			//console.log('' + festivals.list.length + '-' + this.list.length)
			const futureDates = this.future()
			//console.log(futureDates.length)
			return festivals.getMany(futureDates
				.map(d => d.festival))
		},
		upcomingDatedFestivals (daysAhead = 14) {
			//console.log('' + festivals.list.length + '-' + this.list.length)
			const futureDates = this.soon(daysAhead)
			//console.log('this.upcomingDatedFestivals')
			//console.log(daysAhead)
			//console.log(futureDates.length)
			return festivals.getMany(futureDates
				.map(d => d.festival))
		}
}}