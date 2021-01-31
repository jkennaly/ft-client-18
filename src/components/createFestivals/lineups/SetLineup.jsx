// 	src/components/createFestivals/lineups/SetLineup.jsx
// Services
import Auth from '../../../services/auth.js';
const auth = Auth;



import m from 'mithril'
import _ from 'lodash'
import NavCard from '../../../components/cards/NavCard.jsx';
import EventSelector from '../../detailViewsPregame/fields/event/EventSelector.jsx'
import SeriesWebsiteField from '../../detailViewsPregame/fields/series/SeriesWebsiteField.jsx'

import ArtistEntryModal from '../../modals/ArtistEntryModal.jsx'
import UIButton from '../../../components/ui/UIButton.jsx';
import {remoteData} from '../../../store/data';

import {seriesChange, festivalChange} from '../../../store/action/event'

const festivals = remoteData.Festivals
const series = remoteData.Series

var addingArtist = false

var lineupIds = []
var lastLineupIds = []
var displayArtists = []
var lastDisplayArtists = []

const upload = festival => e => {
	//console.log('SetLineup', festival, e)
    var file = e.target.files[0]
    lineupIds = []
    var data = new FormData()
    data.append("myfile", file)

    return remoteData.Lineups.upload(data, festival)
    	.then(() => festivals.subjectDetails({subject: festival, subjectType: FESTIVAL}))
}

const entryFormHandler = (formDOM, festivalId) => {

	const formData = new FormData(formDOM);
	const newEntry = {};
	lineupIds = []
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
	const dataSet = remoteData.Lineups.forFestival(festivalId)
	const checked = Object.keys(newEntry)
		.filter(k => !newEntry[k].indexOf('radio'))
		.map(k => {
			const split = newEntry[k].split('-')
			return {
				band: parseInt(split[1], 10),
				priority:parseInt(split[2], 10),
				festival: festivalId
		}})
	// deleteLineups
	const deleteLineupIds = Object.keys(newEntry)
		.filter(k => !newEntry[k].indexOf('delete'))
		.map(k => parseInt(newEntry[k].split('-')[1], 10))
		//.map(v => {console.log(v);return v;})
		.map(v => remoteData.Lineups.getIdFromArtistFest(v, festivalId))
	// updateLineups
	const updateLineups = checked
		.filter(l => !_.some(dataSet, l))
		.map(v => {_.set(v, 'id', remoteData.Lineups.getIdFromArtistFest(v.band, festivalId));return v;})


	//console.log('Lineups changes')
	//console.log(festivalId)
	//console.log(deleteLineupIds)
	//console.log(updateLineups)
	Promise.all([
		deleteLineupIds.length ? remoteData.Lineups.batchDelete({ids: deleteLineupIds}) : true,
		updateLineups.length ? remoteData.Lineups.batchUpdate(updateLineups) : true
	])
	//formDOM.reset();
};
const seriesId = () => parseInt(m.route.param('seriesId'), 10)
const festivalId = () => parseInt(m.route.param('festivalId'), 10)

const SetLineup = {
	name: 'SetLineup',
		preload: (rParams) => {
			//if a promise returned, instantiation of component held for completion
			//route may not be resolved; use rParams and not m.route.param
			const seriesId = parseInt(rParams.seriesId, 10)
			const festivalId = parseInt(rParams.festivalId, 10)
			//console.log('preload SetLineup', seriesId, festivalId, rParams)
			if(festivalId) return Promise.all([
				remoteData.ArtistPriorities.remoteCheck(),
				festivalId ? festivals.subjectDetails({subject: festivalId, subjectType: FESTIVAL}) : '',
				seriesId ? series.subjectDetails({subject: seriesId, subjectType: SERIES}) : ''
				]) 
				.catch(console.error)
			
		},
		oninit: ({attrs}) => {


			if (attrs.titleSet) attrs.titleSet(`Artist Lineup`)
			//map each artist in the festival lineup
			lineupIds = remoteData.Lineups.getFestivalArtistIds(festivalId()).sort((a, b) => a - b)
			displayArtists = remoteData.Artists.getMany(lineupIds)
		},
	
	onbeforeupdate: () => {
		lastLineupIds = lineupIds
		lineupIds = remoteData.Lineups.getFestivalArtistIds(festivalId()).sort((a, b) => a - b)
		lastDisplayArtists = displayArtists
		displayArtists = remoteData.Artists.getMany(lineupIds)
		const sameLineup = _.isEqual(lastDisplayArtists, displayArtists)
		//console.log('update set lineup', sameLineup, lastLineupIds, lineupIds)
		return !sameLineup
	},
	
		view: () => <div class="main-stage">
		{
			//console.log('view SetLineup', seriesId(), festivalId())
		}
				<EventSelector 
					seriesId={seriesId()}
					festivalId={festivalId()}
					festivalChange={festivalChange(seriesId())}
					seriesChange={seriesChange}
				/>

		{series.get(seriesId()) ? <SeriesWebsiteField id={seriesId()} /> : ''}
			{festivalId() ? <div class="main-stage-content-scroll">
				<label for="lineup-uploader">
			        {`Upload a file with the artist list (one name per line)`}
			      </label>
			      <input id="lineup-uploader" type="file" name="lineup-file" onchange={upload(festivalId())}/>
			      <UIButton action={() => addingArtist = true} buttonName="Add Single Artist" />
	  				<div><form name="entry-form" id="entry-form" ><table>
			    		<tr><th>Artist</th>{
			    			//list of day names, ordered by daysOffset
			    			remoteData.ArtistPriorities.list
			    			.sort((a, b) => a.level - b.level)
			    				.map(h =>  <th>{h.name}</th>)
			    		}<th class="delete-column">Remove from Lineup</th></tr>
				    	{
				    		displayArtists
				.sort((a, b) => {
					const aPriId = remoteData.Lineups.getPriFromArtistFest(a.id, festivalId())
					const bPriId = remoteData.Lineups.getPriFromArtistFest(b.id, festivalId())
					if(aPriId === bPriId) return a.name.localeCompare(b.name)
					const aPriLevel = remoteData.ArtistPriorities.getLevel(aPriId)
					const bPriLevel = remoteData.ArtistPriorities.getLevel(bPriId)
					return aPriLevel - bPriLevel
				})
				.map(data => <tr><td>{data.name}</td>
					{remoteData.ArtistPriorities.list
						.sort((a, b) => a.level - b.level)
						.map(h => <td><input 
							type="radio" 
							name={"radio-" + data.id}
							value={'radio-' + data.id + '-' + h.id} 
							checked={h.id === remoteData.Lineups.getPriFromArtistFest(data.id, festivalId()) ? 'checked' : ''}/>
				</td>)}<td><input 
							type="radio" 
							name={"radio-" + data.id}
							value={'delete-' + data.id} />
				</td></tr>)
				    	}
			    	</table></form>
					<ArtistEntryModal 
						display={addingArtist} 
						hide={() => addingArtist = false}
						action={artistPromise => artistPromise}
						festivalId={festivalId()}
					/>
			      <UIButton action={() => entryFormHandler(document.getElementById('entry-form'), festivalId())} buttonName="Update Artist Priorities" /></div>
       		</div> : ''}
		</div>
}
export default SetLineup;
