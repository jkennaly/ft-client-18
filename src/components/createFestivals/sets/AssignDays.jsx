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
const auth = Auth;

import { remoteData } from '../../../store/data';

import { seriesChange, festivalChange, dateChange } from '../../../store/action/event'
import EventSelector from '../../detailViewsPregame/fields/event/EventSelector.jsx'
import ToggleControl from '../../ui/ToggleControl.jsx';
import AddSingleArtist from '../lineups/AddSingleArtist.jsx'
import globals from '../../../services/globals.js';


import UIButton from '../../ui/UIButton.jsx';


const series = remoteData.Series
const festivals = remoteData.Festivals
const dates = remoteData.Dates
const days = remoteData.Days
const sets = remoteData.Sets
const lineups = remoteData.Lineups


const dateId = () => parseInt(m.route.param('dateId'), 10)
const festivalId = () => parseInt(m.route.param('festivalId'), 10)
const seriesId = () => parseInt(m.route.param('seriesId'), 10)
const user = attrs => _.isInteger(attrs.userId) ? attrs.userId : 0
const roles = attrs => _.isArray(attrs.userRoles) ? attrs.userRoles : []
const lineup = (fid = festivalId()) => lineups.forFestival(fid)


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
	const dataSet = sets.getMany(dates.getSubSetIds(
		dateId))

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
			}
		})
	//deleteSets: delete any sets that are in the dataset but not checked
	const deleteSets = dataSet
		.filter(s => !_.find(checked, c => c.band === s.band && c.day === s.day))
		.reduce((pv, cv) => {
			pv.setIds.push(cv.id)
			return pv
		}, { setIds: [] })
	//createSets: create any set that is checked but is not in the dataset
	const createSets = checked
		.filter(s => !sets.find(c => c.band === s.band && c.day === s.day))
		.reduce((pv, cv) => {
			if (!pv[cv.day]) pv[cv.day] = []
			pv[cv.day].push(cv.band)
			return pv
		}, {})

	//console.log('AssignDays Set changes')
	//console.log(newEntry);
	//console.log(dataSet);
	//console.log(checked);
	//console.log(deleteSets);
	//console.log(createSets);

	sets.createForDays(createSets);
	deleteSets.length && sets.batchDelete(deleteSets);

	const festivalId = dates.getFestivalId(dateId)

	const currentlyUnscheduledLineups = lineups.getUnscheduledForFestival(festivalId)


	const unscheduled = Object.keys(newEntry)
		.filter(k => /unscheduled/.test(k))
		.map(k => {
			const split = k.split('-')
			return {
				band: parseInt(split[1], 10),
				festival: festivalId,
				unscheduled: 1
			}
		})

	//remove unscheduled form any lineup object that has it currently but not in unscheduled
	const removeUnscheduled = currentlyUnscheduledLineups
		.filter(l => !_.some(unscheduled, updated => l.band === updated.band))
		.map(l => {
			l.unscheduled = 0
			return l
		})

	const addUnscheduled = unscheduled
		.filter(updated => !_.some(currentlyUnscheduledLineups, l => l.band === updated.band))
		.map(updated => _.assign(lineups.getFromArtistFest(updated.band, festivalId), updated))
		.filter(newL => newEl && newEl.id || console.error('new lineup update missing id', newEl, festivalId) && false)


	//console.log('Delete lineup ids')
	// deleteLineups
	const deleteLineupIds = Object.keys(newEntry)
		.filter(k => /delete/.test(k))
		.map(k => parseInt(k.split('-')[1], 10))
		.map(v => { console.log('delete lineup', v, festivalId, _.get(lineups.find({ band: v, festival: festivalId }), 'id')); return v; })
		.map(v => _.get(lineups.find({ band: v, festival: festivalId }), 'id'))
		.filter(x => x)

	// updateLineups
	const updateLineups = [...removeUnscheduled, ...addUnscheduled]



	//console.log('Lineups changes')
	//console.log(festivalId)
	//console.log(deleteLineupIds)
	//console.log(updateLineups)

	deleteLineupIds.length && lineups.batchDelete({ ids: deleteLineupIds })
	updateLineups.length && lineups.batchUpdate(updateLineups)
	m.route.set('/launcher')
	//formDOM.reset();
};

const hideRows = vnode => {
	//console.log('AssignDays.onupdate')
	const rows = Array.from(vnode.dom.querySelectorAll('tr'))
	if (hideSelected) {
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

const dayHeaders = dateId => days.getMany(
	dates.getSubIds(dateId))
	.sort((a, b) => a.daysOffset - b.daysOffset)


var hideSelected = false
var lineupIds = []
var lastLineupIds = []
var setIds = []
var lastSetIds = []
var displayArtists = []
var lastDisplaySets = []
var displaySets = []
var lastDisplayArtists = []
const AssignDays = {
	name: 'AssignDays',
	preload: (rParams) => {
		//console.log('dayDetails preload')
		//if a promise returned, instantiation of component held for completion
		//route may not be resolved; use rParams and not m.route.param
		const seriesId = parseInt(rParams.seriesId, 10)
		const festivalId = parseInt(rParams.festivalId, 10)
		const dateId = parseInt(rParams.dateId, 10)
		//messages.forArtist(dateId)
		//console.log('Research preload', seriesId, festivalId, rParams)
		return Promise.all([
			!seriesId ? series.remoteCheck(true) : true,
			seriesId && !festivalId ? Promise.all([
				series.subjectDetails({ subject: seriesId, subjectType: globals.SERIES }),
				festivals.remoteCheck(true)
			]) : true,
			festivalId && !dateId ? Promise.all([
				festivals.subjectDetails({ subject: festivalId, subjectType: globals.FESTIVAL }),
				dates.remoteCheck(true)
			]) : true,
			dateId ? dates.subjectDetails({ subject: dateId, subjectType: globals.DATE }) : true,
			festivalId ? lineups.maintainList({ where: { festival: festivalId } }) : true,
			dateId ? sets.maintainList({ where: { day: { inq: dates.getSubDayIds(dateId) } } }) : true
		])
	},
	oninit: ({ attrs }) => {
		if (attrs.titleSet) attrs.titleSet(`Assign artists to days`)
		lineupIds = remoteData.Lineups.getFestivalArtistIds(festivalId()).sort((a, b) => a - b)
		setIds = dateId() ? remoteData.Dates.getSubSetIds(dateId()).sort((a, b) => a - b) : []
		displayArtists = remoteData.Artists.getMany(lineupIds)
		displaySets = sets.getMany(setIds)

	},
	onupdate: vnode => {
		hideRows(vnode)

	},
	onbeforeupdate: () => {
		lastLineupIds = lineupIds
		lineupIds = remoteData.Lineups.getFestivalArtistIds(festivalId()).sort((a, b) => a - b)
		lastDisplayArtists = displayArtists
		displayArtists = remoteData.Artists.getMany(lineupIds)
		lastDisplaySets = displaySets
		setIds = dateId() ? remoteData.Dates.getSubSetIds(dateId()).sort((a, b) => a - b) : []
		displaySets = sets.getMany(setIds)

		const sameLineup = _.isEqual(lastDisplayArtists, displayArtists)
		const sameSets = _.isEqual(lastDisplaySets, displaySets)
		//console.log('update set lineup', sameLineup, lastLineupIds, lineupIds)
		return !sameLineup || !sameSets
	},
	view: vnode => <div class="main-stage">
		<EventSelector
			seriesId={seriesId()}
			festivalId={festivalId()}
			dateId={dateId()}
			seriesChange={seriesChange}
			festivalChange={festivalChange(seriesId())}
			dateChange={dateChange(seriesId(), festivalId())}
		/>
		{dateId() ? <div>
			<AddSingleArtist festivalId={festivalId()} popModal={vnode.attrs.popModal} />
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
			<UIButton action={() => entryFormHandler(document.getElementById('entry-form'), dateId())} buttonName="SAVE" />

			<div class="main-stage-content-scroll">
				{!dateId() ? '' : <form name="entry-form" id="entry-form" class={roles(vnode.attrs).includes('admin') ? '' : 'hidden'}>
					<table>
						<tr><th>Remove from lineup</th><th>Artist</th>{
							//list of day names, ordered by daysOffset
							dayHeaders(dateId())
								.map(h => <th>{h.name}</th>)
						}<th>Off-schedule Set</th></tr>
						{
							//map each artist in the festival lineup
							remoteData.Artists.getMany(
								dates.getLineupArtistIds(dateId()))
								.sort((a, b) => a.name.localeCompare(b.name))
								.map(data => <tr>
									<td><input
										type="checkbox"
										name={'delete-' + data.id}
									/></td>
									<td>{data.name}</td>
									{dayHeaders(dateId())
										.map(h => <td><input
											type="checkbox"
											name={'box-' + data.id + '-' + h.id}
											checked={_.find(sets.getMany(days.getSubSetIds(
												h.id)), s => s.band === data.id) ? true : false} />
										</td>)}
									<td><input
										type="checkbox"
										name={'box-' + data.id + '-unscheduled'}
										checked={_.some(lineups.getUnscheduledForFestival(festivalId()), l => l.band === data.id)}
									/></td>
								</tr>)
						}
					</table>
				</form>}
			</div>
		</div> : ''}
	</div>

}
export default AssignDays;
