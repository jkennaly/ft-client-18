// src/store/action/event.js

import m from 'mithril'
import _ from 'lodash'

export const seriesChange = (e, onchange) => {
	if(!onchange) return 	m.route.set(m.route.get().split(`?`)[0], {seriesId: _.isInteger(e) ? e : e.target.value})
		return onchange(e)
	
	//resetSelector('#date')
}
export const festivalChange = seriesId => (e, onchange) => {
	if(!onchange) return m.route.set(m.route.get().split(`?`)[0], {seriesId: seriesId, festivalId: _.isInteger(e) ? e : e.target.value})
		return onchange(e)
	//resetSelector('#date')
}
export const dateChange = (seriesId, festivalId) => (e, onchange) => {
	if(!onchange) return m.route.set(m.route.get().split(`?`)[0], {seriesId: seriesId, festivalId: festivalId, dateId: _.isInteger(e) ? e : e.target.value})
		return onchange(e)
	//resetSelector('#date')
}
export const dayChange = (seriesId, festivalId, dateId) => (e, onchange) => {
	if(!onchange) return m.route.set(m.route.get().split(`?`)[0], {seriesId: seriesId, festivalId: festivalId, dateId: dateId, dayId: _.isInteger(e) ? e : e.target.value})
		return onchange(e)
	//resetSelector('#date')
}
export const stageChange = (seriesId, festivalId, dateId, dayId) => (e, onchange) => {
	if(!onchange) return m.route.set(m.route.get().split(`?`)[0], {seriesId: seriesId, festivalId: festivalId, dateId: dateId, dayId: dayId, stageId: _.isInteger(e) ? e : e.target.value})
		return onchange(e)
	//resetSelector('#date')
}