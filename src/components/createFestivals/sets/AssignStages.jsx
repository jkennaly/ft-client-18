// AssignStages.jsx


//copy from earlier date (this will copy all set data and overwrite all existing set data for this day)


//draw a table where each row is:
	//artist name
	//checkbox for each artist

//table headers are day names for the date


import m from 'mithril'
import _ from 'lodash'

import {remoteData} from '../../../store/data';

import {seriesChange, festivalChange, dateChange, dayChange} from '../../../store/action/event'
import EventSelector from '../../detailViewsPregame/fields/event/EventSelector.jsx'

import ToggleControl from '../../ui/ToggleControl.jsx';


import UIButton from '../../ui/UIButton.jsx';

const series = remoteData.Series
const festivals = remoteData.Festivals
const dates = remoteData.Dates
const days = remoteData.Days
const sets = remoteData.Sets

const dayId = () => parseInt(m.route.param('dayId'), 10)
const dateId = () => parseInt(m.route.param('dateId'), 10)
const festivalId = () => parseInt(m.route.param('festivalId'), 10)
const seriesId = () => parseInt(m.route.param('seriesId'), 10)
const user = attrs => _.isInteger(attrs.userId) ? attrs.userId : 0
const roles = attrs => _.isArray(attrs.userRoles) ? attrs.userRoles : []

var hideSelected = false
const entryFormHandler = (formDOM, dayId) => {

	const formData = new FormData(formDOM);
	const newEntry = {};

	Array.from(formData.entries()).map((entryValue) => {
		const key = entryValue[0];
		const value = entryValue[1];

		switch (value) {
      case "false":
	      newEntry[key] = false;
        break;
      case "true":
	      newEntry[key] = true;
        break;
      default:
	      newEntry[key] = value;
        break;
    }
	});
	const dataSet = sets.getMany(days.getSubSetIds(
							dayId))
	const checked = Object.keys(newEntry)
		.filter(k => !k.indexOf('box'))
		.map(k => {
			const split = k.split('-')
			return {
				id: 	parseInt(split[1], 10),
				stage: 	parseInt(split[2], 10)
		}})
	//unstageSets: clear stage from any sets that are in the dataset but not checked
	const unstageSets = dataSet
		//only delete se
		.filter(s => s.stage)
		.filter(s => !_.some(checked, c => c.id === s.id))
		.map(s => {
			s.stage = 0
			return s
		})
	//count each checked set id
	const countObject = _.countBy(checked, 'id')
	const createNewSetsFor = Object.keys(_.filter(countObject, c => c > 1))
	const simpleUpdates = checked.filter(s => createNewSetsFor.indexOf(s.id) < 0)
	const mixed = checked.filter(s => createNewSetsFor.indexOf(s.id) > -1)
	const sorted = mixed.reduce((pv, cv) => {
		const pvField = _.some(pv.update, s => s.id === cv.id) ? 'create' : 'update'
		pv[pvField].push(cv)
		return pv
	}, {update: [], create: []})

	const updateSets = [...simpleUpdates, ...sorted.update, ...unstageSets]

	//createSets: create any set that is checked more than once
	const createSets = sorted.create.map(x => {
		const base = sets.get(x.id)
		return {
			band: base.band,
			day: base.day,
			stage: x.stage
		}
	})

	//console.log(newEntry);
	//console.log(createSets);
	//console.log(updateSets);

	sets.batchCreate(createSets);
	sets.batchUpdate(updateSets);

	m.route.set('/launcher')
	//formDOM.reset();
};
const stageHeaders = festivalId => remoteData.Places.forFestival(festivalId)
	.sort((a, b) => a.priority - b.priority)

const hideRows = vnode => {
	console.log('AssignDays.onupdate')
	const rows = Array.from(vnode.dom.querySelectorAll('tr'))
	if(hideSelected) {
		const rowsToHide = rows
			.filter(r => r.querySelectorAll('input:checked').length)
			.filter(r => !/hidden/.test(r.className))
		
		rowsToHide
			.forEach(r => r.className += ' hidden')

		const rowsToShow = rows
			.filter(r => !r.querySelectorAll('input:checked').length)
			.filter(r => /hidden/.test(r.className))
		
		rowsToShow.forEach(r => r.className.replace(' hidden', ''))

	//console.log(rowsToShow.length)
	} else {
		rows
		.filter(r => /hidden/.test(r.className))
		.forEach(r => r.className = r.className.replace('hidden', ''))
	}
}
// Fix table head
function tableFixHead (e) {
    const el = e.target,
          sT = el.scrollTop;
    el.querySelectorAll("thead th").forEach(th => 
      th.style.transform = `translateY(${sT}px)`
    );
}
const AssignSetStages = {
		name: 'AssignStages',
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
			if (attrs.titleSet) attrs.titleSet(`Assign artists to stages`)
		},
		onupdate: vnode => {
			hideRows(vnode)
		},
		oncreate: vnode => {
			
			vnode.dom.querySelectorAll(".tableFixHead").forEach(el => 
			    el.addEventListener("scroll", tableFixHead)
			);
		},
		view: vnode => <div class="main-stage">
				<EventSelector 
					seriesId={seriesId()}
					festivalId={festivalId()}
					dateId={dateId()}
					dayId={dayId()}
					seriesChange={seriesChange}
					festivalChange={festivalChange(seriesId())}
					dateChange={dateChange(seriesId(), festivalId())}
					dayChange={dayChange(seriesId(), festivalId(), dateId())}
				/>
			    <ToggleControl
			offLabel={'Show All'}
			onLabel={'Hide assigned'}
			
			getter={() => hideSelected}
			setter={newState => {
				hideSelected = newState
				//console.log('AssignDays hideSelected ' +  hideSelected)
				hideRows(vnode)
			}}
			permission={roles(vnode.attrs).includes('admin')}

		/>
			<UIButton action={() => entryFormHandler(document.getElementById('entry-form'), dayId())} buttonName="SAVE" />
				
				<div class="main-stage-content-scroll">
			    {!dayId() ? '' : <form name="entry-form" id="entry-form" class={roles(vnode.attrs).includes('admin') ? '' : 'hidden' }>
			    	<table>
			    		<thead><th>Artist</th>{
			    			//list of day names, ordered by daysOffset
			    			stageHeaders(festivalId())
			    				.map(h =>  <th>{h.name}</th>)
			    		}</thead>
				    	{
				    		//map each set to an artist
				    		sets.getMany(days.getSubSetIds(
								dayId()))
								.sort((a, b) => {
									const aPriId = remoteData.Lineups.getPriFromArtistFest(a.band, festivalId())
									const bPriId = remoteData.Lineups.getPriFromArtistFest(b.band, festivalId())
									if(aPriId === bPriId) {
										const an = sets.getArtistName(a.id)
										const bn = sets.getArtistName(b.id)
										return (an ? an : '').localeCompare(bn ? bn : '')
									} 
									const aPriLevel = remoteData.ArtistPriorities.getLevel(aPriId)
									const bPriLevel = remoteData.ArtistPriorities.getLevel(bPriId)
									return aPriLevel - bPriLevel
								})
								.map(data => <tr><td>{sets.getArtistName(data.id)}</td>
									{stageHeaders(festivalId())
										.map(h => <td><input 
												type="checkbox" 
												name={'box-' + data.id + '-' + h.id} 
												checked={data.stage === h.id}/>
										</td>)}
									</tr>)
				    	}
			    	</table>
					</form>}
			</div>
			</div>
	    
}
export default AssignSetStages;
