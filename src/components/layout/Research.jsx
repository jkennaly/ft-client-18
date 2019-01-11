// Research.jsx
// Services
import Auth from '../../services/auth.js';
const auth = new Auth();


import m from 'mithril'
import _ from 'lodash'
import localforage from 'localforage'

import LauncherBanner from '../../components/ui/LauncherBanner.jsx'
import WidgetContainer from '../../components/layout/WidgetContainer.jsx'
import ResearchWidget from '../../components/widgets/canned/ResearchWidget.jsx'
import EventSelector from '../detailViewsPregame/fields/event/EventSelector.jsx'

import {remoteData} from '../../store/data';

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
			remoteData.Series.loadList()
			remoteData.Festivals.loadList()
			remoteData.Dates.loadList()
			remoteData.Venues.loadList()
			remoteData.Days.loadList()
			remoteData.Artists.loadList()
			remoteData.Lineups.loadList()
			remoteData.Messages.loadList()
			remoteData.Sets.loadList()
			remoteData.Images.loadList()
			auth.getFtUserId()
				.then(id => userId = id)
				.then(m.redraw)
				.catch(err => m.route.set('/auth'))
			

		},
		oncreate: () => localforage.getItem('status.researchLayout')
				.then(obj => {
					console.log('Research oncreate status:')
					console.log(obj)
					if(!obj) return
					const seriesValue = {target: {value: obj.status.series}}
					const festivalValue = {target: {value: obj.status.festival}}
					seriesChange(seriesValue)
					festivalChange(festivalValue)
					selectIndexOfValue('ft-series-selector', obj.status.series)
					selectIndexOfValue('ft-festival-selector', obj.status.festival)
				}),
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
				<div>
					<WidgetContainer>
						<ResearchWidget festivalId={festivalId} />
						
					</WidgetContainer>
				</div>
			</div>
		</div>
}}
export default Research;
