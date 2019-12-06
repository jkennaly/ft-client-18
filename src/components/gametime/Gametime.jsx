// src/components/gametime/Gametime.jsx

import m from 'mithril'
import _ from 'lodash'
import localforage from 'localforage'
localforage.config({
	name: "FestiGram",
	storeName: "FestiGram"
})

import Schedule from './Schedule.jsx'
import NowPlaying from './NowPlaying.jsx'
import Locations from './Locations.jsx'
import SetDetail from './SetDetail.jsx'
import GametimeBanner from './GametimeBanner.jsx';
import {subjectData} from '../../store/subjectData'
import {remoteData} from '../../store/data'


const {Sets: sets, Dates: dates, Days: days} = remoteData

const jsx = {
	view: ({attrs}) =>
		<div class="main-stage-gametime">
		<GametimeBanner 
			title={`gametime`} 
			dateId={attrs.dateId}
			dayId={attrs.dayId}
		
		/>
			<div class="main-stage-gametime-content-scroll">
			{
				/locations/.test(m.route.get()) ? <Locations dateId={attrs.dateId} dayId={attrs.dayId} subjectObject={attrs.subjectObject} /> :
				attrs.subjectType === 9 ? <Schedule dateId={attrs.dateId} dayId={attrs.dayId} subjectObject={attrs.subjectObject}/> : 
				attrs.subjectType === 8 ? <NowPlaying dateId={attrs.dateId} dayId={attrs.dayId} subjectObject={attrs.subjectObject}/> : 
				<SetDetail dateId={attrs.dateId} dayId={attrs.dayId} subjectObject={attrs.subjectObject} userId={attrs.userId}/> 
			}
			</div>
		</div>
}
const Gametime = {
	name: 'Gametime',
		preload: (rParams) => {
			//if a promise returned, instantiation of component held for completion
			//route may not be resolved; use rParams and not m.route.param
		const dateId = rParams.subjectType === '8' ? parseInt(rParams.subject, 10) :
			rParams.subjectType === '3' ? sets.getDateId(parseInt(rParams.subject, 10)) :
			rParams.subjectType === '9' ? days.getDateId(parseInt(rParams.subject, 10)) :
			0
			//messages.forArtist(dateId)
			//console.log('Research preload', seriesId, festivalId, rParams)
			if(dateId) return dates.subjectDetails({subject: dateId, subjectType: DATE})
		},
	view: ({attrs}) => {
		//console.log('gametime attrs', attrs)
		const mapping = {
			dateId: attrs.subjectType === 8 ? attrs.subject :
				attrs.subjectType === 3 ? sets.getDateId(attrs.subject) :
				attrs.subjectType === 9 ? days.getDateId(attrs.subject) :
				0,
			dayId: attrs.subjectType === 9 ? attrs.subject :
				attrs.subjectType === 3 ? sets.getDayId(attrs.subject) :
				attrs.subjectType === 8 ? dates.activeDay(attrs.subject) :
				0,
			setId: attrs.subjectType === 3 ? attrs.subject :
				0,
			userId: attrs.userId,
			subjectObject: {
				subject: attrs.subject,
				subjectType: attrs.subjectType
			},
			subject: attrs.subject,
			subjectType: attrs.subjectType
		}
	
		return m(jsx, mapping )
	}
}

export default Gametime;