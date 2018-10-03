// AssignTimes.jsx


//copy from earlier date (this will copy all set data and overwrite all existing set data for this day)


//draw a table where each row is:
	//artist name
	//checkbox for each artist

//table headers are day names for the date


const m = require("mithril");
const _ = require("lodash");
// Services
import Auth from '../../../services/auth.js';
const auth = new Auth();

import {remoteData} from '../../../store/data';

import EventSelector from '../../detailViewsPregame/fields/event/EventSelector.jsx'

import ArtistCard from '../../cards/ArtistCard.jsx'
import ScheduleSet from '../../fields/ScheduleSet.jsx'
import SetScheduleModal from './SetScheduleModal.jsx'

import ScheduleLadder from '../../layout/ScheduleLadder.jsx'
import WidgetContainer from '../../layout/WidgetContainer.jsx'

import FixedCardWidget from '../../widgets/FixedCard.jsx'

import UIButton from '../../ui/UIButton.jsx';

var userId = 0


const AssignTimes = (vnode) => {
	const stageHeaders = _.memoize(festivalId => remoteData.Places.forFestival(festivalId)
				.sort((a, b) => a.priority - b.priority)
		)
	var seriesId = 0
	var festivalId = 0
	var dateId = 0
	var dayId = 0
	var stageId = 0
	var schedulingSet = false
	var addSet = {}
	var festivalArtists = []
	var dayAndStageUnscheduled = []
	var scheduledSets = []
	const seriesChange = e => {
		//console.log(e.target.value)
		seriesId = parseInt(e.target.value, 10)
		festivalId = 0
		//resetSelector('#festival')
		dateId = 0
		dayId = 0
		stageId = 0
		//resetSelector('#date')
	}
	const festivalChange = e => {
		//console.log(e.target.value)
		festivalId = parseInt(e.target.value, 10)
		dateId = 0
		dayId = 0
		stageId = 0

		festivalArtists = _.flow(
			remoteData.Festivals.getLineupArtistIds,
			remoteData.Artists.getMany,
			)(festivalId)
			.sort((a, b) => {
				const aPriId = remoteData.Lineups.getPriFromArtistFest(a.id, festivalId)
				const bPriId = remoteData.Lineups.getPriFromArtistFest(b.id, festivalId)
				if(aPriId === bPriId) return a.name.localeCompare(b.name)
				const aPriLevel = remoteData.ArtistPriorities.getLevel(aPriId)
				const bPriLevel = remoteData.ArtistPriorities.getLevel(bPriId)
				return aPriLevel - bPriLevel
		})
		//resetSelector('#date')
	}
	const dateChange = e => {
		//console.log(e)
		dateId = parseInt(e.target.value, 10)
		dayId = 0
		stageId = 0
	}
	const dayChange = e => {
		//console.log(e)
		dayId = parseInt(e.target.value, 10)
		stageId = 0
		dayAndStageUnscheduled = []
		scheduledSets = []
		m.redraw()
	}
	const stageChange = e => {
		//console.log(e)
		stageId = parseInt(e.target.value, 10)
		dayAndStageUnscheduled = remoteData.Sets.forDayAndStage(dayId, stageId)
			.filter(x => !x.end)

		scheduledSets = remoteData.Sets.forDayAndStage(dayId, stageId)
			.filter(x => x.end)
		m.redraw()
	}

	return {
		oninit: () => {
			remoteData.Series.loadList()
			remoteData.Festivals.loadList()
			remoteData.Dates.loadList()
			remoteData.Days.loadList()
			remoteData.Sets.loadList()
			remoteData.Artists.loadList()
			remoteData.Lineups.loadList()
			remoteData.Messages.loadList()
			remoteData.Places.loadList()
			remoteData.ArtistPriorities.loadList()
			auth.getFtUserId()
				.then(id => userId = id)
				.then(() => {
					
						})
				.then(m.redraw)
				.catch(console.log)
		},
		oncreate: () => {

},
		view: ({attrs}) => <div class="main-stage">
			<EventSelector 
					seriesId={seriesId}
					festivalId={festivalId}
					dateId={dateId}
					dayId={dayId}
					festivalChange={festivalChange}
					seriesChange={seriesChange}
					dateChange={dateChange}
					dayChange={dayChange}
					stageChange={stageChange}
				/>
		    {!dayId || !stageId ? '' : <div class={userId > 0 ? '' : 'hidden' }>
		    	<WidgetContainer>	
					<FixedCardWidget header="Festival Lineup" quarter={true} containerClasses={'artist-pool'}>
						{
							festivalArtists
								.map(data => <ArtistCard 
									data={data}
									clickFunction={() => {
										addSet = {
											band: data.id,
											user:userId,
											day: dayId,
											stage: stageId
										}
										schedulingSet = true
										//feed data to schedule new set to modal
										//feed data to eliminate this ArtistCard to new modal
										//make modal visible
									}}
								/>)
						}
					</FixedCardWidget>	
					<FixedCardWidget header="Day and Stage Lineup" quarter={true} containerClasses={'artist-pool'}>
						{
							dayAndStageUnscheduled
								.map(data => <ArtistCard 
									data={remoteData.Artists.get(data.band)}
									clickFunction={() => {
										addSet = data
										schedulingSet = true
										//feed data to schedule new set to modal
										//feed data to eliminate this ArtistCard to new modal
										//make modal visible
									}}
								/>)
						}
					</FixedCardWidget>	
					<ScheduleLadder>
						{scheduledSets
							.filter(data => data.end)
							.map(data => <ScheduleSet 
								set={data}
								clickFunction={() => {
									addSet = data
									schedulingSet = true
									//feed data to schedule new set to modal
									//feed data to eliminate this ArtistCard to new modal
									//make modal visible
								}}
							/>)}
					</ScheduleLadder>
				</WidgetContainer>
				</div>}
					<SetScheduleModal 
						display={schedulingSet} 
						hide={() => schedulingSet = false}
						action={(data, verb) => promise => promise
							.then(result => {
								//remove from old grouping (unless from festival)
								const removeRequired = !!addSet.id
								const removeArray = addSet.end ? scheduledSets : dayAndStageUnscheduled
								//console.log('pre remove: ' + removeArray.length)
								if(removeRequired) _.remove(removeArray, el => el.id === addSet.id)
								//console.log('post remove: ' + removeArray.length)
								//add to new grouping (unless a removal)
								const addRequired = verb !== 'DELETE'
								const addArray = scheduledSets
								if(addRequired) addArray.push(data)
								m.redraw()
								return result
							})
							.catch(err => {console.log(err);console.log(verb);console.log(data);})}
						set={addSet}
						user={userId}
					/>
		</div>
	    
}}
export default AssignTimes;
