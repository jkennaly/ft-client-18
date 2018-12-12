// filter.js
import m from 'mithril'
//import _ from 'lodash'

import fieldSelecter from './fieldSelecter.js'
import {remoteData} from './data';



exports.availableSelecters = {
	unfiltered: [],
	series: ['seriesName']
}

exports.selecterIdFields = {
	artist: ['band'],
	series: ['series']
}

const filters = {
	unfiltered: {
		menuPriority: 1,
		menuDisplay: dataType => true,
		menuExpansion: 'single',
		subMenu: preLoad => dataType => [],
		filterFunction: preLoad => data => true
	},
	averageRating: {
		menuPriority: 5,
		menuDisplay: dataType => false,
		menuExpansion: 'static',
		subMenu: preLoad => dataType => [],
		filterFunction: preLoad => data => true
	},
	event: {
		chain: ['series', 'festival', 'date', 'day', 'set'],
		dataFields:['Series', 'Festivals', 'Dates', 'Days', 'Sets'],
		filterMethods:['getSubFestivalIds', 'getSubDateIds', 'getSubDayIds', 'getSubSetIds'],
		superMethods:['getSeriesId', 'getFestivalId', 'getDateId', 'getDayId'],
		menuPriority: 2,
		menuDisplay: dataType => filters.event.dataFields.indexOf(dataType) > 0,
		menuExpansion: 'dynamic',
		subMenu: preLoad => dataType => {
			if(!filters.event.menuDisplay(dataType) || (preLoad && !preLoad.displayLevel)) return [] 
			//preLoad contains the data being used ro filter the currently displayed events
		if(!preLoad) preLoad = {
				displayLevel: filters.event.dataFields.indexOf(dataType),
				filterLevel: 0,
				filterId: 0
			}
			
			const thisFilter = filters.event
			const displayLevel = preLoad.displayLevel
			const filterLevel = preLoad.filterLevel
			const filterId = preLoad.filterId

			//firstLine (if filter level is greater than 0): decrement filter Level
			const baseLine = filterLevel || filterId ? [['All ' + thisFilter.dataFields[filterLevel], {
				displayLevel: displayLevel,
				filterLevel: filterLevel && filterId ? filterLevel - 1 : 0,
				filterId:  filterLevel && filterId ? remoteData[thisFilter.dataFields[filterLevel]][thisFilter.superMethods[filterLevel - 1]](filterId) : 0
			}]] : []



			//next lines:
				//display the events that are one level greater than the current filter level that meet the current filter
			const nextFilterLevel = filterLevel + (filterId ? 1 : 0)
			const eventMenuData = displayLevel > nextFilterLevel ? remoteData[thisFilter.dataFields[nextFilterLevel]].getEventNamesWithIds(filterId) : []
			//console.log('event subMenu')
			//console.log(preLoad)
			//console.log(dataType)
			//console.log(eventMenuData)
			const menuLines = eventMenuData
				.map(n => [n[0], {
					displayLevel: displayLevel,
					filterLevel: nextFilterLevel,
					filterId: n[1]
				}])
				//sorted the way those events would be sorted in the current context on that event types main view
	//return ['test filter sub menu item']
		
			return baseLine.concat(menuLines)
		},
		filterFunction: preLoad => {
			//console.log('event filterFunction')
			//console.log(preLoad)
			const thisFilter = filters.event
			const displayLevel = preLoad.displayLevel
			const filterLevel = preLoad.filterLevel
			const filterId = preLoad.filterId
			//returns a filter that accepts the data to be filtered
			
			//bail if the levels are invalid
			if(!displayLevel || !_.isNumber(filterLevel) || !filterId ||
				filterLevel < 0 ||
				displayLevel <= filterLevel) {
				return data => true
			}
			//console.log('event filterFunction levels ok')
			//if the levels are adjacent, return the simple filterFunction
			if(displayLevel - filterLevel < 2) {
				return data => data[thisFilter.chain[displayLevel - 1]] === filterId
			}
			//console.log('event filterFunction complex')
			const remoteDataField = thisFilter.dataFields[filterLevel]
			const filterMethodIndex = displayLevel - 2
			const filterMethod = thisFilter.filterMethods[filterMethodIndex]
			const superIds = remoteData[remoteDataField][filterMethod](filterId)
			const dataField = thisFilter.chain[displayLevel - 1]

			//console.log(superIds)
			//console.log(remoteDataField)
			//console.log(filterMethod)
			//console.log(filterId)
			//console.log(dataField)

			return data => superIds.indexOf(data[dataField]) > -1
		}
	}
}

exports.filterMenu = dataType => _.toPairs(_.pickBy(filters, v => v.menuDisplay(dataType)))
	//.map(x => {console.log(x); return x;})
	.sort((a, b) => a[1].menuPriority - b[1].menuPriority)
	.map(x => x[0])

exports.possibleFilterSelecters = filterName => (dataType, preLoad) => {
	
	return filters[filterName].subMenu(preLoad)(dataType)
}

exports.selecterFields = selecter => _.uniq(_.flatMap(Object.keys(exports.selecterIdFields)
	.filter(selecterType => selecter.indexOf(selecterType) === 0),
	t => exports.selecterIdFields[t]))

const filter = {
	unfiltered: () => () => true,
	event: preLoad => filters.event.filterFunction(preLoad)

}

export default filter