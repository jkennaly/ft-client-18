// AssignStages.jsx


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

import EventSelector from '../../detailViewsPregame/fields/event/EventSelector.jsx'


import LauncherBanner from '../../../components/ui/LauncherBanner.jsx';

import UIButton from '../../ui/UIButton.jsx';

var userId = 0

const entryFormHandler = (formDOM, userId, dayId) => {

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
	const dataSet = _.flow(remoteData.Days.getSubSetIds,
							remoteData.Sets.getMany
						)(dayId)
	const checked = Object.keys(newEntry)
		.filter(k => !k.indexOf('box'))
		.map(k => {
			const split = k.split('-')
			return {
				id: 	parseInt(split[1], 10),
				stage: 	parseInt(split[2], 10)
		}})
	//deleteSets: delete any sets that are in the dataset but not checked
	const deleteSets = dataSet
		.filter(s => !_.some(checked, c => c.id === s.id))
		.reduce((pv, cv) => {
			pv.setIds.push(cv.id)
			return pv
		}, {setIds: [], user: userId})
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

	const updateSets = simpleUpdates.concat(sorted.update)

	//createSets: create any set that is checked more than once
	const createSets = sorted.create.map(x => {
		const base = remoteData.Sets.get(x.id)
		return {
			band: base.band,
			user: userId,
			day: base.day,
			stage: x.stage
		}
	})

	//console.log(newEntry);
	//console.log(deleteSets);
	//console.log(createSets);
	//console.log(updateSets);

	remoteData.Sets.batchCreate(createSets);
	remoteData.Sets.batchDelete(deleteSets);
	remoteData.Sets.batchUpdate(updateSets);

	//formDOM.reset();
};

const AssignSetStages = (vnode) => {
	const stageHeaders = _.memoize(festivalId => remoteData.Places.forFestival(festivalId)
				.sort((a, b) => a.priority - b.priority)
		)
	var seriesId = 0
	var festivalId = 0
	var dateId = 0
	var dayId = 0
	const seriesChange = e => {
		//console.log(e.target.value)
		seriesId = parseInt(e.target.value, 10)
		festivalId = 0
		//resetSelector('#festival')
		dateId = 0
		dayId = 0
		//resetSelector('#date')
	}
	const festivalChange = e => {
		//console.log(e.target.value)
		festivalId = parseInt(e.target.value, 10)
		dateId = 0
		dayId = 0
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
			remoteData.Days.loadList()
			remoteData.Sets.loadList()
			remoteData.Artists.loadList()
			remoteData.Lineups.loadList()
			remoteData.Messages.loadList()
			remoteData.Places.loadList()
			remoteData.ArtistPriorities.loadList()
			auth.getFtUserId()
				.then(id => userId = id)
				.then(m.redraw)
				.catch(err => m.route.set('/auth'))
		},
		view: () => <div class="main-stage">
			<LauncherBanner 
				title="Assign artists to stages"
			>
				<EventSelector 
					seriesId={seriesId}
					festivalId={festivalId}
					dateId={dateId}
					dayId={dayId}
					festivalChange={festivalChange}
					seriesChange={seriesChange}
					dateChange={dateChange}
					dayChange={dayChange}
				/>
			</LauncherBanner>
				<div class="main-stage-content-scroll">
			    {!dayId ? '' : <form name="entry-form" id="entry-form" class="{userId > 0 ? '' : 'hidden' }">
			    	<table>
			    		<tr><th>Artist</th>{
			    			//list of day names, ordered by daysOffset
			    			stageHeaders(festivalId)
			    				.map(h =>  <th>{h.name}</th>)
			    		}</tr>
				    	{
				    		//map each set to an artist
				    		_.flow(
								remoteData.Days.getSubSetIds,
								remoteData.Sets.getMany
							)(dayId)
								.sort((a, b) => {
									const aPriId = remoteData.Lineups.getPriFromArtistFest(a.band, festivalId)
									const bPriId = remoteData.Lineups.getPriFromArtistFest(b.band, festivalId)
									if(aPriId === bPriId) return remoteData.Sets.getArtistName(a.id).localeCompare(remoteData.Sets.getArtistName(b.id))
									const aPriLevel = remoteData.ArtistPriorities.getLevel(aPriId)
									const bPriLevel = remoteData.ArtistPriorities.getLevel(bPriId)
									return aPriLevel - bPriLevel
								})
								.map(data => <tr><td>{remoteData.Sets.getArtistName(data.id)}</td>
									{stageHeaders(festivalId)
										.map(h => <td><input 
												type="checkbox" 
												name={'box-' + data.id + '-' + h.id} 
												checked={data.stage === h.id}/>
										</td>)}
									</tr>)
				    	}
			    	</table>
					<UIButton action={() => entryFormHandler(document.getElementById('entry-form'), userId, dayId)} buttonName="SAVE" />
				</form>}
			</div>
			</div>
	    
}}
export default AssignSetStages;
