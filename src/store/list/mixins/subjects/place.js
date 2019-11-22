// place.js

const sortNamesWithIdsByName = ([aName, aId], [bName, bId]) => aName.localeCompare(bName)


export default {
	getPlaceName (id) {
		const v = this.get(id)
			if(!v || !v.name) return ''
			return v.name
	},
	getPlaceNames () {return this.list.map(x => this.getPlaceName(x.id))},
	getPlaceNamesWithIds (superId) { return this.list
		.filter(e => !superId || !this.superField || e[this.superField] === superId)
		.map(x => [this.getPlaceName(x.id), x.id])
		.sort(sortNamesWithIdsByName)
	},
	getName (id) {return this.getPlaceName(id)},
	getTimezone (id) {
		//console.log('Venues.getTimezone', id, this)
		const v = this.get(id)
		if(!v || !v.name) return ''
		return v.timezone
	},
}