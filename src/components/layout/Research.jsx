// Research.jsx
// Services
import Auth from '../../services/auth.js';
const auth = new Auth();


import m from 'mithril'
import _ from 'lodash'
import localforage from 'localforage'
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min'


import FestivalCard from '../../components/cards/FestivalCard.jsx';
import LauncherBanner from '../../components/ui/LauncherBanner.jsx'
import WidgetContainer from '../../components/layout/WidgetContainer.jsx'
import ActivityCard from '../../components/cards/ActivityCard.jsx'
import ResearchWidget from '../../components/widgets/canned/ResearchWidget.jsx'
import ActivityWidget from '../../components/widgets/canned/ActivityWidget.jsx'
import ArtistSearchWidget from '../../components/widgets/canned/ArtistSearchWidget.jsx'
import EventSelector from '../detailViewsPregame/fields/event/EventSelector.jsx'


import {remoteData, subjectData} from '../../store/data';


const Research = (vnode) => {
	var seriesId = 0
	var festivalId = 0
	var dateId = 0
	var dayId = 0
	var userId = 0
	var subjectObject = {}
	var messageArray = []
	var discussing = false
	var rating = 0
	const seriesChange = e => {
		//console.log(e.target.value)
		seriesId = parseInt(e.target.value, 10)
		festivalId = 0
		//resetSelector('#festival')
		dateId = 0
		dayId = 0
		localforage.setItem('status.researchLayout', {
			status: {
				series: seriesId,
				festival: festivalId
			}
		})
		//resetSelector('#date')
	}
	const festivalChange = e => {
		//console.log(e.target.value)
		festivalId = parseInt(e.target.value, 10)
		dateId = 0
		dayId = 0
		localforage.setItem('status.researchLayout', {
			status: {
				series: seriesId,
				festival: festivalId
			}
		})
		remoteData.Messages.loadForFestival(festivalId)
		//resetSelector('#date')
	}
	const dateChange = e => {
		//console.log(e)
		dateId = parseInt(e.target.value, 10)
		dayId = 0
	}
	const dayChange = e => {
		//console.log(e)
		dayId = parseInt(e.target.value, 10)
	}

	return {
		oninit: () => {
			//console.log('Research init')
		remoteData.Messages.loadList()
		remoteData.MessagesMonitors.loadList()
		remoteData.Images.loadList()
		remoteData.Series.loadList()
		remoteData.Festivals.loadList()
		remoteData.Dates.loadList()
		remoteData.Days.loadList()
		remoteData.Sets.loadList()
		remoteData.Venues.loadList()
		remoteData.Places.loadList()
		remoteData.Lineups.loadList()
      	remoteData.ArtistPriorities.loadList()
      	remoteData.StagePriorities.loadList()
      	remoteData.ArtistAliases.loadList()
		remoteData.Artists.loadList()
		remoteData.Users.loadList()
		localforage.getItem('status.researchLayout')
			.then(obj => {
				//console.log('Research oncreate status:')
				//console.log(obj)
				if(!obj) return
				const seriesValue = {target: {value: obj.status.series}}
				const festivalValue = {target: {value: obj.status.festival}}
				seriesChange(seriesValue)
				festivalChange(festivalValue)
			})
			.catch(err => console.log(err))
		},
		view: () => 
		<div class="main-stage">
			<LauncherBanner 
				title="Research" 
			/>
				<EventSelector 
					seriesId={seriesId}
					festivalId={festivalId}
					festivalChange={festivalChange}
					seriesChange={seriesChange}
				/>
				<FestivalCard seriesId={seriesId}
					festivalId={festivalId}
					eventId={festivalId}
				/>
				<WidgetContainer>
					<ResearchWidget festivalId={festivalId} />
					<ArtistSearchWidget festivalId={festivalId} overlay={'research'} />
					<ActivityWidget festivalId={festivalId} />
				</WidgetContainer>

		</div>
}}
export default Research;
