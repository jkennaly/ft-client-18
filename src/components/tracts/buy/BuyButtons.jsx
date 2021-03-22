// src/components/tracts/buy/BuyButtons.jsx

import _ from 'lodash'
import m from 'mithril'
import moment from 'dayjs'
import Tract from '../Tract.jsx'
import BuyAccessLine from '../../fields/form/BuyAccessLine.jsx'

import {remoteData} from '../../../store/data'

const {
  Users: users,
  Days: days,
  Dates: dates,
  Festivals: festivals,
  Sets: sets
} = remoteData

/*

			_.map(attrs.costObject, 
				(v, k, a) => /Id$/.test(k) ? '' : <BuyAccessLine 
					name={ k === 'day' ? festivals.getEventName(attrs.festivalId) :
							k === 'date' ? festivals.getEventName(attrs.festivalId) :
							k === 'festival' ? festivals.getEventName(attrs.festivalId) :
							k === 'full' ? 'Full Access' :
							k}
					subtitle={k === 'day' ? days.getEventNameArray(attrs.dayId).reduce((n, pn, i) => {
						if(i === 2) n = pn
						if(i === 3) n = `${n} ${pn}`
						return n
					}, '') :
							k === 'date' ? dates.getPartName(attrs.dateId) :
							k === 'festival' ? 'All Dates' :
							k === 'full' ? 'All events through ' + moment(attrs.endTime).format('ll') :
							k}
					value= {v}
					accessLevel= {k}
					clickFunction={e => {
						e.stopPropagation()
						e.preventDefault()
						const rdf = k === 'day' ? days :
							k === 'date' ? dates :
							k === 'festival' ? festivals :
							users
						const id = k === 'day' ? attrs.dayId :
							k === 'date' ? attrs.dateId :
							festivalId
						let buyObject = {}
						buyObject[k] = v
						buyObject[`${k}Id`] = a[`${k}Id`]
						//console.log('bucksSpend buyObject', buyObject)
						return rdf.buy(buyObject)
					}}
					unaffordable={attrs.currentBucks < v}
				/>)
*/

const jsx = {
	view: ({attrs}) => <Tract extracted ={true}>
		<div>{
			_.map(attrs.costObject, 
				(v, k, a) => /Id$/.test(k) ? '' : <BuyAccessLine 
					name={ k === 'day' ? festivals.getEventName(attrs.festivalId) :
							k === 'date' ? festivals.getEventName(attrs.festivalId) :
							k === 'festival' ? festivals.getEventName(attrs.festivalId) :
							k === 'full' ? 'Full Access' :
							k}
					subtitle={k === 'day' ? days.getEventNameArray(attrs.dayId).reduce((n, pn, i) => {
						if(i === 2) n = pn
						if(i === 3) n = `${n} ${pn}`
						return n
					}, '') :
							k === 'date' ? dates.getPartName(attrs.dateId) :
							k === 'festival' ? 'All Dates' :
							k === 'full' ? 'All events through ' + moment(attrs.endTime).format('ll') :
							k}
					value= {v}
					accessLevel= {k}
					clickFunction={e => {
						e.stopPropagation()
						e.preventDefault()
						const rdf = k === 'day' ? days :
							k === 'date' ? dates :
							k === 'festival' ? festivals :
							users
						const id = k === 'day' ? attrs.dayId :
							k === 'date' ? attrs.dateId :
							festivalId
						let buyObject = {}
						buyObject[k] = v
						buyObject[`${k}Id`] = a[`${k}Id`]
						//console.log('bucksSpend buyObject', buyObject)
						return rdf.buy(buyObject)
					}}
					unaffordable={attrs.currentBucks < v}
				/>)
		}</div>
	</Tract>
}

export default {
	oninit: ({attrs}) => {

		const seriesId = attrs.eventObject && attrs.eventObject.seriesId ? attrs.eventObject.seriesId : undefined
		const festivalId = attrs.eventObject && attrs.eventObject.festivalId ? attrs.eventObject.festivalId : undefined
		const dateId = attrs.eventObject && attrs.eventObject.dateId ? attrs.eventObject.dateId : undefined
		const dayId = attrs.eventObject && attrs.eventObject.dayId ? attrs.eventObject.dayId : undefined
		
		const rdf = dayId ? days :
			dateId ? dates :
			festivalId ? festivals :
			users
		const id = dayId ? dayId :
			dateId ? dateId :
			festivalId ? festivalId :
			undefined

		const costObject = rdf.costCache(id)
		const endTime = users.endCache(id)
		const currentBucks = users.bucksCache(id)
		return Promise.all([rdf.cost(id),
			users.wouldend(id),
			users.bucks(id)
		])
	},
	view: ({attrs}) => {
        
		const seriesId = attrs.eventObject && attrs.eventObject.seriesId ? attrs.eventObject.seriesId : undefined
		const festivalId = attrs.eventObject && attrs.eventObject.festivalId ? attrs.eventObject.festivalId : undefined
		const dateId = attrs.eventObject && attrs.eventObject.dateId ? attrs.eventObject.dateId : undefined
		const dayId = attrs.eventObject && attrs.eventObject.dayId ? attrs.eventObject.dayId : undefined
		
		const rdf = dayId ? days :
			dateId ? dates :
			festivalId ? festivals :
			users
		const id = dayId ? dayId :
			dateId ? dateId :
			festivalId ? festivalId :
			undefined

		const costObject = rdf.costCache(id)
		const endTime = users.endCache(id)
		const currentBucks = users.bucksCache(id)

		console.log('BuyButtons', costObject, endTime, currentBucks)
        const mapping = {
            costObject: costObject,
            dayId: dayId,
            dateId: dateId,
            festivalId: festivalId,
            endTime: endTime,
            currentBucks: currentBucks
        }
        return m(jsx, mapping)
    }
}