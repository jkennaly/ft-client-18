// AssignDays.jsx


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

import DateSelector from '../../detailViewsPregame/fields/date/DateSelector.jsx'
import FestivalSelector from '../../detailViewsPregame/fields/festival/FestivalSelector.jsx'

import ToggleControl from '../../ui/ToggleControl.jsx';

import LauncherBanner from '../../../components/ui/LauncherBanner.jsx';

import UIButton from '../../ui/UIButton.jsx';


const entryFormHandler = (formDOM, dateId) => {

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
	const dataSet = _.flow(remoteData.Dates.getSubSetIds,
							remoteData.Sets.getMany
						)(dateId)
	const checked = Object.keys(newEntry)
		.filter(x => x)
		.filter(k => /^box/.test(k))
		//skip creating a set for unscheduled artists
		.filter(k => !/unscheduled/.test(k))
		.map(k => {
			const split = k.split('-')
			return {
				band: parseInt(split[1], 10),
				day: parseInt(split[2], 10)
		}})
	//deleteSets: delete any sets that are in the dataset but not checked
	const deleteSets = dataSet
		.filter(s => !_.find(checked, c => c.band === s.band && c.day === s.day))
		.reduce((pv, cv) => {
			pv.setIds.push(cv.id)
			return pv
		}, {setIds: []})
	//createSets: create any set that is checked but is not in the dataset
	const createSets = checked
		.filter(s => !_.find(dataSet, c => c.band === s.band && c.day === s.day))
		.reduce((pv, cv) => {
			if(!pv[cv.day]) pv[cv.day] = []
			pv[cv.day].push(cv.band)
			return pv
		}, {})

	//console.log('AssignDays Set changes')
	//console.log(newEntry);
	//console.log(dataSet);
	//console.log(checked);
	//console.log(deleteSets);
	//console.log(createSets);

	remoteData.Sets.createForDays(createSets);
	remoteData.Sets.batchDelete(deleteSets);

	const festivalId = remoteData.Dates.getFestivalId(dateId)

	const currentlyUnscheduledLineups = remoteData.Lineups.getUnscheduledForFestival(festivalId)


	const unscheduled = Object.keys(newEntry)
		.filter(k => /unscheduled/.test(k))
		.map(k => {
			const split = k.split('-')
			return {
				band: parseInt(split[1], 10),
				festival: festivalId,
				unscheduled: 1
		}})

	//remove unscheduled form any lineup object that has it currently but not in unscheduled
	const removeUnscheduled = currentlyUnscheduledLineups
		.filter(l => !_.some(unscheduled, updated => l.band === updated.band))
		.map(l => {
			l.unscheduled = 0
			return l
		})

	const addUnscheduled = unscheduled
		.filter(updated => !_.some(currentlyUnscheduledLineups, l => l.band === updated.band))
		.map(updated => _.assign(remoteData.Lineups.getFromArtistFest(updated.band, festivalId), updated))


	//console.log('Delete lineup ids')
	// deleteLineups
	const deleteLineupIds = Object.keys(newEntry)
		.filter(k => /delete/.test(k))
		//.map(v => {console.log(v);return v;})
		.map(k => parseInt(k.split('-')[1], 10))
		.map(v => remoteData.Lineups.getIdFromArtistFest(v, festivalId))

	// updateLineups
	const updateLineups = [...removeUnscheduled, ...addUnscheduled]



	//console.log('Lineups changes')
	//console.log(festivalId)
	//console.log(deleteLineupIds)
	//console.log(updateLineups)

	remoteData.Lineups.batchDelete({ids: deleteLineupIds})
	remoteData.Lineups.batchUpdate(updateLineups)
	m.route.set('/launcher')
	//formDOM.reset();
};

var userId = 0
const AssignDays = (vnode) => {
	const dayHeaders = _.memoize(dateId => _.flow(
				remoteData.Dates.getSubIds,
				remoteData.Days.getMany)(dateId)
				.sort((a, b) => a.daysOffset - b.daysOffset)
		)
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
	var seriesId = 0
	var festivalId = 0
	var dateId = 0
	var unscheduledLineups = []
	var hideSelected = false
	const seriesChange = e => {
		//console.log(e.target.value)
		seriesId = parseInt(e.target.value, 10)
		festivalId = 0
		//resetSelector('#festival')
		dateId = 0
		//resetSelector('#date')
	}
	const festivalChange = e => {
		//console.log(e.target.value)
		festivalId = parseInt(e.target.value, 10)
		dateId = 0
		unscheduledLineups = remoteData.Lineups.getUnscheduledForFestival(festivalId)
		//resetSelector('#date')
	}
	const dateChange = e => {
		//console.log(e)
		dateId = parseInt(e.target.value, 10)
	}

	return {
		oninit: () => {
			userId = auth.userId()
		},
		onupdate: hideRows,
		view: vnode => <div class="main-stage">
			<LauncherBanner 
				title="Assign artists to days"
			>
			</LauncherBanner>
    
				<div>
					<label for="series">
				        {`Festival Name`}
				    </label>
					    <select id="series" name="series" onchange={seriesChange}>
					    	<option value={0} selected="selected">{`Select a festival`}</option>
				      		{remoteData.Series.getEventNamesWithIds()
					      		.map(s => <option value={s[1]}>{s[0]}</option>)
					      	}
				    	</select>
					<FestivalSelector 
						seriesId={seriesId}
						festivalId={festivalId}
						festivalChange={festivalChange}
					/>
					<DateSelector 
						festivalId={festivalId}
						dateId={dateId}
						dateChange={dateChange}
					/>
			    </div>
			    <ToggleControl
			offLabel={'Show All'}
			onLabel={'Hide assigned'}
			
			getter={() => hideSelected}
			setter={newState => {
				hideSelected = newState
				console.log('AssignDays hideSelected ' +  hideSelected)
				hideRows(vnode)
			}}

		/>
		<UIButton action={() => entryFormHandler(document.getElementById('entry-form'), dateId)} buttonName="SAVE" />
				
				<div class="main-stage-content-scroll">
			    {!dateId ? '' : <form name="entry-form" id="entry-form" class="{userId > 0 ? '' : 'hidden' }">
			    	<table>
			    		<tr><th>Remove from lineup</th><th>Artist</th>{
			    			//list of day names, ordered by daysOffset
			    			dayHeaders(dateId)
			    				.map(h =>  <th>{h.name}</th>)
			    		}<th>Off-schedule Set</th></tr>
				    	{
				    		//map each artist in the festival lineup
				    		_.flow(
								remoteData.Dates.getLineupArtistIds,
								remoteData.Artists.getMany
							)(dateId)
								.sort((a, b) => {
									const aPriId = remoteData.Lineups.getPriFromArtistFest(a.id, festivalId)
									const bPriId = remoteData.Lineups.getPriFromArtistFest(b.id, festivalId)
									if(aPriId === bPriId) return a.name.localeCompare(b.name)
									const aPriLevel = remoteData.ArtistPriorities.getLevel(aPriId)
									const bPriLevel = remoteData.ArtistPriorities.getLevel(bPriId)
									return aPriLevel - bPriLevel
								})
								.map(data => <tr>
									<td><input 
										type="checkbox" 
										name={'delete-' + data.id} 
										/></td>
									<td>{data.name}</td>
									{dayHeaders(dateId)
										.map(h => <td><input 
											type="checkbox" 
											name={'box-' + data.id + '-' + h.id} 
											checked={_.find(_.flow(
												remoteData.Days.getSubSetIds,
												remoteData.Sets.getMany
												)(h.id), s => s.band === data.id) ? true : false}/>
										</td>)}
									<td><input 
										type="checkbox" 
										name={'box-' + data.id + '-unscheduled'} 
										checked={_.some(unscheduledLineups, l => l.band === data.id)}
									/></td>
								</tr>)
				    	}
			    	</table>
					</form>}
			</div>
			</div>
	    
}}
export default AssignDays;
