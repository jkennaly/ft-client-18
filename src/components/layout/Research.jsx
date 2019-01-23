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
import FixedCardWidget from '../../components/widgets/FixedCard.jsx';
import ResearchWidget from '../../components/widgets/canned/ResearchWidget.jsx'
import ArtistSearchWidget from '../../components/widgets/canned/ArtistSearchWidget.jsx'
import EventSelector from '../detailViewsPregame/fields/event/EventSelector.jsx'

import DiscussModal from '../modals/DiscussModal.jsx';

import {remoteData, subjectData} from '../../store/data';

const selectIndexOfValue = (id, val) => {
	var el= document.getElementById(id)
	var options = el.options
	var n= options.length; 
	for (var i= 0; i<n; i++) {
    if (options[i].value=== val) {
        el.selectedIndex= i;
        break;
    }
}
}

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
			console.log('Research init')
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
			auth.getFtUserId()
				.then(id => userId = id)
				.then(() => m.redraw())
				.catch(err => m.route.set('/auth'))
			

		},
		oncreate: () => localforage.getItem('status.researchLayout')
				.then(obj => {
					//console.log('Research oncreate status:')
					//console.log(obj)
					if(!obj) return
					const seriesValue = {target: {value: obj.status.series}}
					const festivalValue = {target: {value: obj.status.festival}}
					seriesChange(seriesValue)
					festivalChange(festivalValue)
					selectIndexOfValue('ft-series-selector', obj.status.series)
					selectIndexOfValue('ft-festival-selector', obj.status.festival)
				})
				.catch(err => console.log(err)),
		view: () => 
		<div class="main-stage">
			<LauncherBanner 
				action={() => {}}
				title="FestivalTime Research" 
			/>
			<div class="main-stage-content">
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
				<div>
					<WidgetContainer>
						<ResearchWidget festivalId={festivalId} />
						<ArtistSearchWidget festivalId={festivalId} userId={userId} />
						
						<FixedCardWidget header="Recent Activity">
						{
							userId ? _.take(
								_.uniqBy(remoteData.Messages.recentDiscussionEvent(userId,
									remoteData.Festivals.getSubjectObject(festivalId)), 
									v => '' + v.fromuser + '.' + v.messageType  + '.' + v.subjectType + '.' + v.subject)
									.sort((a, b) => {
										const am = moment(a.timestamp).utc()
										const bm = moment(b.timestamp).utc()
										return bm.diff(am)
									}
								), 5)
								.map(data => <ActivityCard 
									messageArray={[data]} 
									discusser={data.fromuser}
									rating={remoteData.Artists.getRating(data.subject, data.fromuser)}
									overlay={'discuss'}
									shortDefault={true}
									headline={subjectData.name(data.subject, data.subjectType)}
									headact={e => {
										if(data.subjectType === 2) m.route.set("/artists" + "/pregame" + '/' + data.subject)

									}}
									discussSubject={(s, me, r) => {
										subjectObject = _.clone(s)
										messageArray = _.clone(me)
										rating = r
										//console.log('ArtistDetail ArtistReviewCard discussSubject me length ' + me.length)
										discussing = true
									}}
								/>)
							: ''
						}
						</FixedCardWidget>
					</WidgetContainer>
				</div>
			</div>
			{<DiscussModal
				display={discussing} 
				hide={sub => {discussing = false;}}
				subject={subjectObject}
				messageArray={messageArray}
				reviewer={messageArray.length ? messageArray[0].fromuser : 0}
				user={userId}
				rating={rating}
			/>}

		</div>
}}
export default Research;
