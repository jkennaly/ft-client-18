// AssignTimes.jsx


//copy from earlier date (this will copy all set data and overwrite all existing set data for this day)


//draw a table where each row is:
	//artist name
	//checkbox for each artist

//table headers are day names for the date


import m from 'mithril'
import _ from 'lodash'
// Services
import Auth from '../../../services/auth.js';
const auth = new Auth();

import {remoteData} from '../../../store/data';

import {seriesChange, festivalChange, dateChange, dayChange, stageChange} from '../../../store/action/event'
import EventSelector from '../../detailViewsPregame/fields/event/EventSelector.jsx'

import ArtistCard from '../../cards/ArtistCard.jsx'
import ScheduleSet from '../../fields/ScheduleSet.jsx'
import SetScheduleModal from '../../modals/SetScheduleModal.jsx'

import AddSingleArtist from '../lineups/AddSingleArtist.jsx'

import ScheduleLadder from '../../layout/ScheduleLadder.jsx'
import WidgetContainer from '../../layout/WidgetContainer.jsx'

import FixedCardWidget from '../../widgets/FixedCard.jsx'
import LineupWidget from '../../widgets/canned/LineupWidget.jsx'

import UIButton from '../../ui/UIButton.jsx';

const {
	Series: series,
	 Festivals: festivals,
	 Dates: dates,
	 Days: days,
	 Sets: sets,
	 Lineups: lineups,
	 Artists: artists,
	 Places: places
	} = remoteData

/*
const series = remoteData. Series
const festivals = remoteData. Festivals
const dates = remoteData. Dates
const days = remoteData. Days
const sets = remoteData. Sets
const lineups = remoteData. Lineups
const artists = remoteData. Artists
const places = remoteData. Places
*/

const dayId = () => parseInt(m.route.param('dayId'), 10)
const dateId = () => parseInt(m.route.param('dateId'), 10)
const festivalId = () => parseInt(m.route.param('festivalId'), 10)
const seriesId = () => parseInt(m.route.param('seriesId'), 10)
const stageId = () => parseInt(m.route.param('stageId'), 10)
const user = attrs => _.isInteger(attrs.userId) ? attrs.userId : 0
const roles = attrs => _.isArray(attrs.userRoles) ? attrs.userRoles : []

const dayAndStageUnscheduled = (dayId, stageId) => sets.getFiltered({day: dayId, stage: stageId})
			.filter(x => !x.end)
const scheduledSets = (dayId, stageId) => sets.getFiltered({day: dayId, stage: stageId})
			.filter(x => x.end)
const stageHeaders = festivalId => places.forFestival(festivalId)
			.sort((a, b) => a.priority - b.priority)

var schedulingSet = false
var addSet = {}
const AssignTimes = {
		name: 'AssignTimes',
		preload: (rParams) => {
			//console.log('dayDetails preload')
			//if a promise returned, instantiation of component held for completion
			//route may not be resolved; use rParams and not m.route.param
			const seriesId = parseInt(rParams.seriesId, 10)
			const festivalId = parseInt(rParams.festivalId, 10)
			const dateId = parseInt(rParams.dateId, 10)
			const dayId = parseInt(rParams.dayId, 10)
			//messages.forArtist(dateId)
			//console.log('Research preload', seriesId, festivalId, rParams)
			return Promise.all([
					!seriesId ? series.remoteCheck(true) : true,
					seriesId && !festivalId ? Promise.all([
						series.subjectDetails({subject: seriesId, subjectType: SERIES}),
						festivals.remoteCheck(true)
						]) : true,
					festivalId && !dateId ? Promise.all([
						festivals.subjectDetails({subject: festivalId, subjectType: FESTIVAL}),
						dates.remoteCheck(true)
						]) : true,
					dateId && !dayId  ? dates.subjectDetails({subject: dateId, subjectType: DATE}) : true,
					dayId ? days.subjectDetails({subject: dayId, subjectType: DAY}) : true
			])
		},
		oninit: ({attrs}) => {
			if (attrs.titleSet) attrs.titleSet(`Assign set times`)
		},
		view: ({attrs}) => <div class="main-stage">
			<EventSelector 
				seriesId={seriesId()}
				festivalId={festivalId()}
				dateId={dateId()}
				dayId={dayId()}
				stageId={stageId()}
				seriesChange={seriesChange}
				festivalChange={festivalChange(seriesId())}
				dateChange={dateChange(seriesId(), festivalId())}
				dayChange={dayChange(seriesId(), festivalId(), dateId())}
				stageChange={stageChange(seriesId(), festivalId(), dateId(), dayId())}
			/>
		    {!dayId() || !stageId() ? '' : <div>
		    <AddSingleArtist festivalId={festivalId()} popModal={attrs.popModal} />
		    
		    	<WidgetContainer>	
		    	<LineupWidget 
		    		festivalId={festivalId()} 
		    		tall={true}
		    		clickFunctionForData={data => (e) => {
					addSet = {
						band: data.id,
						day: dayId(),
						stage: stageId()
					}
					schedulingSet = true
					//feed data to schedule new set to modal
					//feed data to eliminate this ArtistCard to new modal
					//make modal visible
				}} />
					{/*
					<FixedCardWidget header="Festival Lineup" quarter={true} containerClasses={'artist-pool'}>
						{
							artists.getMany(lineups.getFiltered(l => l.festival === festivalId()).map(x => x.band))
								.sort((a, b) => a.name.localeCompare(b.name))
								.map(data => <ArtistCard 
									data={data}
									clickFunction={}
								/>)
						}
					</FixedCardWidget>	
					*/}
					{ dayId() && stageId() ? <FixedCardWidget header="Day and Stage Lineup" quarter={true} containerClasses={'artist-pool'}>
						{
							dayAndStageUnscheduled(dayId(), stageId())
							//.filter(x => console.log('dsu', x) || true)
								.map(data => <ArtistCard 
									data={artists.get(data.band)}
									clickFunction={() => {
										addSet = data
										schedulingSet = true
										//feed data to schedule new set to modal
										//feed data to eliminate this ArtistCard to new modal
										//make modal visible
									}}
								/>)
						}
					</FixedCardWidget>	: ''}
					<ScheduleLadder>
						{scheduledSets(dayId(), stageId())
							.filter(data => data.end)
							//.filter(x => console.log('scheduledSets', x) || true)
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

								m.redraw()
								return result
							})
							.catch(err => {console.error(err);console.log(verb);console.log(data);})}
						set={addSet}
					/>
		</div>
	    
}
export default AssignTimes;
