// ui.js

import filter from './filter.js'
import {filterMenu} from './filter.js'


import sort from './sort.js'
import {availableSelecters} from './sort.js'
import {possibleSelecters} from './sort.js'
import {possibleFilterSelecters} from './filter.js'

import m from 'mithril'

const perspectives = [
	'manage',
	'users',
	'artists',
	'social',
	'fests',
	'dates',
	'series',
	'sets',
	'stages'
]

const contexts = [
	'pregame',
	'gametime'
]

const indices = {
	perspective: 'series',
	context: 'pregame'
}

const sortOptions = {
	pregame: {
		manage:[
			'unsorted'
		],
		users:[
			'unsorted'
		],
		artists:[
			'unsorted'
		],
		social:[
			'unsorted'
		],
		fests:[
			'unsorted'
		],
		dates:[
			'unsorted'
		],
		series:[
			'unsorted'
		],
		sets:[
			'unsorted', 'alphaAsc', 'alphaDesc', 'desc'
		],
		stages:[
			'unsorted'
		]


	},
	gametime: {
		manage:[
			'unsorted'
		],
		users:[
			'unsorted'
		],
		artists:[
			'unsorted'
		],
		social:[
			'unsorted'
		],
		fests:[
			'unsorted'
		],
		dates:[
			'unsorted'
		],
		series:[
			'unsorted'
		],
		sets:[
			'unsorted', 'alphaAsc', 'alphaDesc', 'desc'
		],
		stages:[
			'unsorted'
		]

	}
}

const filterOptions = {
	pregame: {
		manage:[
			'Series'
		],
		users:[
			'Series'
		],
		artists:[
			'Artists'
		],
		social:[
			'Series'
		],
		fests:[
			'Festivals'
		],
		dates:[
			'Dates'
		],
		series:[
			'Series'
		],
		sets:[
			'Sets'
		],
		stages:[
			'Series'
		]


	},
	gametime: {
		manage:[
			'Series'
		],
		users:[
			'Series'
		],
		artists:[
			'Artists'
		],
		social:[
			'Series'
		],
		fests:[
			'Festivals'
		],
		dates:[
			'Dates'
		],
		series:[
			'Series'
		],
		sets:[
			'Sets'
		],
		stages:[
			'Series'
		]

	}
}


const currentSort = {
	pregame: {
		manage: ['unsorted']
		,
		users: ['unsorted']
		,
		artists: ['unsorted']
		,
		social: ['unsorted']
		,
		fests: ['unsorted']
		,
		dates: ['unsorted']
		,
		series: ['unsorted']
		,
		sets: ['unsorted']
		,
		stages: ['unsorted']
		


	},
	gametime: {
		manage: ['unsorted']
		,
		users: ['unsorted']
		,
		artists: ['unsorted']
		,
		social: ['unsorted']
		,
		fests: ['unsorted']
		,
		dates: ['unsorted']
		,
		series: ['unsorted']
		,
		sets: ['unsorted']
		,
		stages: ['unsorted']
		

	}
}

const currentFilters = {
	pregame: {
		manage:[
			'unfiltered',
			{displayLevel: 0, filterLevel: 0, filterId: 0}
		],
		users:[
			'unfiltered',
			{displayLevel: 0, filterLevel: 0, filterId: 0}
		],
		artists:[
			'unfiltered',
			{displayLevel: 0, filterLevel: 0, filterId: 0}
		],
		social:[
			'unfiltered',
			{displayLevel: 0, filterLevel: 0, filterId: 0}
		],
		fests:[
			'unfiltered',
			{displayLevel: 1, filterLevel: 0, filterId: 0}
		],
		dates:[
			'unfiltered',
			{displayLevel: 2, filterLevel: 0, filterId: 0}
		],
		series:[
			'unfiltered',
			{displayLevel: 0, filterLevel: 0, filterId: 0}
		],
		sets:[
			'unfiltered',
			{displayLevel: 4, filterLevel: 0, filterId: 0}
		],
		stages:[
			'unfiltered',
			{displayLevel: 0, filterLevel: 0, filterId: 0}
		]


	},
	gametime: {
		manage:[
			'unfiltered',
			{displayLevel: 0, filterLevel: 0, filterId: 0}
		],
		users:[
			'unfiltered',
			{displayLevel: 0, filterLevel: 0, filterId: 0}
		],
		artists:[
			'unfiltered',
			{displayLevel: 0, filterLevel: 0, filterId: 0}
		],
		social:[
			'unfiltered',
			{displayLevel: 0, filterLevel: 0, filterId: 0}
		],
		fests:[
			'unfiltered',
			{displayLevel: 1, filterLevel: 0, filterId: 0}
		],
		dates:[
			'unfiltered',
			{displayLevel: 2, filterLevel: 0, filterId: 0}
		],
		series:[
			'unfiltered',
			{displayLevel: 0, filterLevel: 0, filterId: 0}
		],
		sets:[
			'unfiltered',
			{displayLevel: 4, filterLevel: 0, filterId: 0}
		],
		stages:[
			'unfiltered',
			{displayLevel: 0, filterLevel: 0, filterId: 0}
		]

	}
}

exports.selected = []
exports.clearSelection = () => exports.selected = []
exports.addSelection = select => exports.selected.push(select)
exports.removeSelection = select => exports.selected = exports.selected.filter(s => s !== select)
exports.toggleSelection = select => {
	//console.log('toggle clicked')
	exports.selected.indexOf(select) > -1 ? 
	exports.removeSelection(select) : 
	exports.selected = [select]
	m.redraw()
}
exports.simpleToggleSelection = select => exports.selected.indexOf(select) > -1 ? 
	exports.removeSelection(select) : 
	exports.addSelection(select)

exports.getAppPerspective = () => indices.perspective
exports.getAppContext = () => indices.context

exports.getAllPerspectives = () => perspectives
exports.getAllContexts = () => contexts

exports.getFilterNames = (context, perspective) => currentFilters[context][perspective][0]
exports.getAllFilterNames = (context, perspective) => filterMenu(filterOptions[context][perspective][0])
exports.getFilterPreLoad = (context, perspective) => currentFilters[context][perspective][1]

exports.getFilter = (context, perspective) => {
	//console.log('getFilter ')
	const filterArray = currentFilters[context][perspective]
	if(filterArray.length < 2) return () => true

	//console.log('getFilter filterArray')
	//console.log(filterArray)
return filter[filterArray[0]](filterArray[1])
/*
			//console.log(context)
			//console.log(perspective)

	const filterArray = currentFilters[context][perspective]
		.map(n => {console.log(n[0]); return filter[n[0]](n[1]);})
		.filter(n => n)

	if(!filterArray.length) return () => true

	return data => filterArray
		.reduce((pv, f) => pv && f(data), true)
		*/
	
}
exports.getSort = (context, perspective) => {
	//console.log('getSort')
	//console.log(currentSort[context][perspective])
	return sort[currentSort[context][perspective][0]]

}
exports.getSortName = (context, perspective) => currentSort[context][perspective][0] + (currentSort[context][perspective][1] ? ':' + currentSort[context][perspective][1] : '')
exports.getCurrentSorts = (context, perspective) => currentSort[context][perspective]
exports.getAllSortNames = (context, perspective) => sortOptions[context][perspective]

exports.setFilterNames = (context, perspective) => (val, display, preLoad) => {
	if(!preLoad) return
		if(_.isString(preLoad) || !Object.keys(preLoad).length) preLoad = currentFilters[context][perspective][1]
	exports.clearSelection()
	currentFilters[context][perspective] = [val, preLoad]
	//console.log('setFilterNames')
	//console.log(currentFilters[context][perspective])
	m.redraw()

/*

	//if there is no parameter selection:
	if(!sortParam && (!availableSelecters[val] || !availableSelecters[val].length)) {
		exports.clearSelection()
		currentSort[context][perspective] = [val]
		m.redraw()
		return
	}
	if(val && sortParam) {
		exports.clearSelection()
		currentSort[context][perspective] = [val, sortParam]
		m.redraw()
		return
	}
	//if there is a parameter selection but the parameter selection screen is hidden:
		//find available parameters
		//display possible selecters
	if(exports.selected.indexOf(val) < 0) {
		exports.addSelection(val)
		return

	}

	//if the parameter selection screen is not hidden:
		//hide the parameter selection screen
	exports.removeSelection(val)
	*/
}

exports.parameterNames = {
	sort: sortName => availableFieldNames => possibleSelecters(sortName)(availableFieldNames),
	filter: filterName => (availableFieldNames, preLoad) => possibleFilterSelecters(filterName)(filterOptions[indices.context][indices.perspective][0], preLoad)
		//.map(x => x[0] + '/' + x[1].filterLevel + '/' + x[1].displayLevel + '/' + x[1].filterId)
		//.map(x => x[0])
}


exports.setSortName = (context, perspective) => (val, sortParam) => {
	//if there is no parameter selection:
	if(!sortParam && (!availableSelecters[val] || !availableSelecters[val].length)) {
		exports.clearSelection()
		currentSort[context][perspective] = [val]
		m.redraw()
		return
	}
	if(val && sortParam) {
		exports.clearSelection()
		currentSort[context][perspective] = [val, sortParam]
		m.redraw()
		return
	}
	//if there is a parameter selection but the parameter selection screen is hidden:
		//find available parameters
		//display possible selecters
	if(exports.selected.indexOf(val) < 0) {
		exports.addSelection(val)
		return

	}

	//if the parameter selection screen is not hidden:
		//hide the parameter selection screen
	exports.removeSelection(val)
}

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
