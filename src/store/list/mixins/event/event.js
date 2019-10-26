// event.js

const sortNamesWithIdsByName = ([aName, aId], [bName, bId]) => aName.localeCompare(bName)


export default {
	getPartName (id) {
		const evt = this.get(id)
		const nameField = evt.name && !this.nameField ? 'name' : this.nameField
		return evt[nameField]
	},
	getEventNameArray (id) {
		const superNames = this.getSuperEventNameArray ? this.getSuperEventNameArray(id) : []
		return [...superNames, this.getPartName(id)]
	},
	getEventName (id) {
		return this.getEventNameArray(id).join(' ')
	},
	getEventNames () {return this.list.map(x => this.getEventName(x.id))},
	getEventNamesWithIds (superId) { return this.list
		.filter(e => !superId || !this.superField || e[this.superField] === superId)
		.map(x => [this.getEventName(x.id), x.id])
		.sort(sortNamesWithIdsByName)
	},
	getName (id) {return this.getEventName(id)},
}