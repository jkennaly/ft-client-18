// ui.js


const m = require("mithril");

const perspectives = [
	'manage',
	'users',
	'artists',
	'social',
	'fests',
	'dates',
	'series',
	'shows',
	'stages'
]

const contexts = [
	'pregame',
	'gametime'
]

const indices = {
	perspective: 'manage',
	context: 'pregame'
}

exports.selected = []
exports.clearSelection = () => exports.selected = []
exports.addSelection = select => exports.selected.push(select)
exports.removeSelection = select => exports.selected = exports.selected.filter(s => s !== select)
exports.toggleSelection = select => exports.selected.indexOf(select) > -1 ? 
	exports.removeSelection(select) : 
	exports.selected = [select]

exports.getAppPerspective = () => indices.perspective
exports.getAppContext = () => indices.context

exports.getAllPerspectives = () => perspectives
exports.getAllContexts = () => contexts

exports.setAppPerspective = val => {
	exports.clearSelection()
	indices.perspective = val
	m.route.set("/" + indices.perspective + "/" + indices.context)

}
exports.setAppContext = val => {
	exports.clearSelection()
	indices.context = val
	m.route.set("/" + indices.perspective + "/" + indices.context)

}
