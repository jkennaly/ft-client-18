// AssignDays.jsx


//copy from earlier date (this will copy all set data and overwrite all existing set data for this day)


//draw a table where each row is:
	//artist name
	//checkbox for each artist

//table headers are day names for the date


import m from 'mithril'
const _ = require("lodash");
// Services
import Auth from '../../../services/auth.js';
const auth = new Auth();

import {remoteData} from '../../../store/data';

import DateSelector from '../../detailViewsPregame/fields/date/DateSelector.jsx'
import FestivalSelector from '../../detailViewsPregame/fields/festival/FestivalSelector.jsx'


import LauncherBanner from '../../../components/ui/LauncherBanner.jsx';

import UIButton from '../../ui/UIButton.jsx';


const entryFormHandler = (formDOM, userId, dateId) => {

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
		.filter(k => !k.indexOf('box'))
		.map(k => {
			const split = k.split('-')
			return {
				band: parseInt(split[1], 10),
				day:parseInt(split[2], 10)
		}})
	//deleteSets: delete any sets that are in the dataset but not checked
	const deleteSets = dataSet
		.filter(s => !_.find(checked, c => c.band === s.band && c.day === s.day))
		.reduce((pv, cv) => {
			pv.setIds.push(cv.id)
			return pv
		}, {setIds: [], user: userId})
	//createSets: create any set that is checked but is not in the dataset
	const createSets = checked
		.filter(s => !_.find(dataSet, c => c.band === s.band && c.day === s.day))
		.reduce((pv, cv) => {
			if(!pv[cv.day]) pv[cv.day] = []
			pv[cv.day].push(cv.band)
			return pv
		}, {})

	//console.log(newEntry);
	console.log(deleteSets);
	console.log(createSets);

	remoteData.Sets.createForDays(createSets, userId);
	remoteData.Sets.batchDelete(deleteSets);

	//formDOM.reset();
};

var userId = 0
const AssignDays = (vnode) => {
	const dayHeaders = _.memoize(dateId => _.flow(
				remoteData.Dates.getSubIds,
				remoteData.Days.getMany)(dateId)
				.sort((a, b) => a.daysOffset - b.daysOffset)
		)
	var seriesId = 0
	var festivalId = 0
	var dateId = 0
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
		//resetSelector('#date')
	}
	const dateChange = e => {
		//console.log(e)
		dateId = parseInt(e.target.value, 10)
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
			remoteData.ArtistPriorities.loadList()
			auth.getFtUserId()
				.then(id => userId = id)
				.then(m.redraw)
				.catch(err => m.route.set('/auth'))
		},
		view: () => <div class="main-stage">
			<LauncherBanner 
				title="Assign artists to days"
			/>
    
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
			    {!dateId ? '' : <form name="entry-form" id="entry-form" class="{userId > 0 ? '' : 'hidden' }">
			    	<table>
			    		<tr><th>Artist</th>{
			    			//list of day names, ordered by daysOffset
			    			dayHeaders(dateId)
			    				.map(h =>  <th>{h.name}</th>)
			    		}</tr>
				    	{
				    		//map each artist in the festival lineup
				    		_.flow(
								remoteData.Dates.getLineupArtistIds,
								remoteData.Artists.getMany
							)(dateId)
								.sort((a, b) => {
									const festivalId = remoteData.Dates.getFestivalId(dateId)
									const aPriId = remoteData.Lineups.getPriFromArtistFest(a.id, festivalId)
									const bPriId = remoteData.Lineups.getPriFromArtistFest(b.id, festivalId)
									if(aPriId === bPriId) return a.name.localeCompare(b.name)
									const aPriLevel = remoteData.ArtistPriorities.getLevel(aPriId)
									const bPriLevel = remoteData.ArtistPriorities.getLevel(bPriId)
									return aPriLevel - bPriLevel
								})
								.map(data => <tr><td>{data.name}</td>
									{dayHeaders(dateId)
										.map(h => <td><input 
												type="checkbox" 
												name={'box-' + data.id + '-' + h.id} 
												checked={_.find(_.flow(
													remoteData.Days.getSubSetIds,
													remoteData.Sets.getMany
													)(h.id), s => s.band === data.id) ? true : false}/>
										</td>)}
									</tr>)
				    	}
			    	</table>
					<UIButton action={() => entryFormHandler(document.getElementById('entry-form'), userId, dateId)} buttonName="SAVE" />
				</form>}
			</div>
	    
}}
export default AssignDays;
