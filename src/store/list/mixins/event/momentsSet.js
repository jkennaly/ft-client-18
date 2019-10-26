// momentsSet.js
export default (days) => { return  {
	getStartMoment (id) {
		const superMoment = days.getBaseMoment(this.getSuperId(id))
		return superMoment.add(this.get(id).start, 'minutes')
		},
	getEndMoment (id) {
		const superMoment = days.getBaseMoment(this.getSuperId(id))
		return superMoment.add(this.get(id).end, 'minutes')
		}
}}