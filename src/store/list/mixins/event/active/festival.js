// festival.js

export default (dates) => { return  {
	future (daysAhead = 0) {
		const dateMethod = daysAhead ? 'soon' : 'future'
		const futureDates = dates[dateMethod](daysAhead)
		//console.log(futureDates.length)
		return this.getMany(futureDates
			.map(d => d.festival))
	},
	activeDate (id) {return  _.some(
		this.getSubDateIds(id), 
		dates.active
	)},
	eventActive (id) {return this.get(id) && (parseInt(this.get(id).year, 10) >= (new Date().getFullYear()))},
	
}}