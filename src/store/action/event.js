// event.js

import m from 'mithril'
import _ from 'lodash'

export const seriesChange = (e) => {
	m.route.set(m.route.get().split(`?`)[0], {seriesId: _.isInteger(e) ? e : e.target.value})
	//resetSelector('#date')
}
export const festivalChange = seriesId => (e) => {
	
	m.route.set(m.route.get().split(`?`)[0], {seriesId: seriesId, festivalId: _.isInteger(e) ? e : e.target.value})
	//resetSelector('#date')
}
export const dateChange = (seriesId, festivalId) => (e) => {
	
	m.route.set(m.route.get().split(`?`)[0], {seriesId: seriesId, festivalId: festivalId, dateId: _.isInteger(e) ? e : e.target.value})
	//resetSelector('#date')
}
export const dayChange = (seriesId, festivalId, dateId) => (e) => {
	
	m.route.set(m.route.get().split(`?`)[0], {seriesId: seriesId, festivalId: festivalId, dateId: dateId, dayId: _.isInteger(e) ? e : e.target.value})
	//resetSelector('#date')
}
export const stageChange = (seriesId, festivalId, dateId, dayId) => (e) => {
	
	m.route.set(m.route.get().split(`?`)[0], {seriesId: seriesId, festivalId: festivalId, dateId: dateId, dayId: dayId, stageId: _.isInteger(e) ? e : e.target.value})
	//resetSelector('#date')
}