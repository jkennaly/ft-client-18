// src/components/layout/Research.jsx
// Services


import m from 'mithril'
import _ from 'lodash'
import localforage from 'localforage'
localforage.config({
	name: "FestiGram",
	storeName: "FestiGram"
})
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min'


import FestivalCard from '../../components/cards/FestivalCard.jsx';
import WidgetContainer from '../../components/layout/WidgetContainer.jsx'
import ActivityCard from '../../components/cards/ActivityCard.jsx'
import ResearchWidget from '../../components/widgets/canned/ResearchWidget.jsx'
import ActivityWidget from '../../components/widgets/canned/ActivityWidget.jsx'
import ArtistSearchWidget from '../../components/widgets/canned/ArtistSearchWidget.jsx'
import EventSelector from '../detailViewsPregame/fields/event/EventSelector.jsx'


import {remoteData} from '../../store/data';
import {subjectData} from '../../store/subjectData'
import {seriesChange, festivalChange} from '../../store/action/event'

const series = remoteData.Series
const festivals = remoteData.Festivals

const seriesId = () => parseInt(m.route.param('seriesId'), 10)
const festivalId = () => parseInt(m.route.param('festivalId'), 10)
const user = attrs => _.isInteger(attrs.userId) ? attrs.userId : 0


const Research = {
	name: 'Research',
		preload: (rParams) => {
			//if a promise returned, instantiation of component held for completion
			//route may not be resolved; use rParams and not m.route.param
			const seriesId = parseInt(rParams.seriesId, 10)
			const festivalId = parseInt(rParams.festivalId, 10)
			//console.log('Research preload', seriesId, festivalId, rParams)
			if(seriesId && !festivalId) series.subjectDetails({subject: seriesId, subjectType: SERIES})
				.catch(console.error)
			if(festivalId) return festivals.subjectDetails({subject: festivalId, subjectType: FESTIVAL})
				.catch(console.error)
			
		},
		oninit: ({attrs}) => {
			//console.log('Research init', attrs.seriesId, attrs.festivalId)
			if (attrs.titleSet) attrs.titleSet(`Research`)
		},
		view: ({attrs}) => 
		<div class="main-stage">
		
				<EventSelector 
					seriesId={seriesId()}
					festivalId={festivalId()}
					festivalChange={festivalChange(seriesId())}
					seriesChange={seriesChange}
				/>
				<FestivalCard 
					seriesId={seriesId()}
					festivalId={festivalId()}
					eventId={festivalId()}
				/>
				<WidgetContainer>
					<ResearchWidget 
						festivalId={festivalId()} 
						userId={user(attrs)} 
						popModal={attrs.popModal}
					/>
					<ActivityWidget 
						festivalId={festivalId()} 
						userId={user(attrs)} 
						popModal={attrs.popModal}
						artistIds={remoteData.Festivals.reviewedArtistIds(festivalId(), user(attrs))} 
					/>
					<ArtistSearchWidget 
						festivalId={festivalId()} 
						overlay={'research'} 
						popModal={attrs.popModal}
					/>
				</WidgetContainer>

		</div>
}
export default Research;
