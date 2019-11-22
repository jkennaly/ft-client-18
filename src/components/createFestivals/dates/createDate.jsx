// createDate.jsx


import m from 'mithril'
import _ from 'lodash'

import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min';

import DetailBanner from '../../ui/DetailBanner.jsx';
import CardContainer from '../../../components/layout/CardContainer.jsx';
import DateCard from '../../../components/cards/DateCard.jsx';


import {remoteData} from '../../../store/data';

import SeriesDescriptionField from '../../detailViewsPregame/fields/series/SeriesDescriptionField.jsx'
import SeriesWebsiteField from '../../detailViewsPregame/fields/series/SeriesWebsiteField.jsx'

import {setMockData} from "../../../store/data";
import UIButton from '../../ui/UIButton.jsx';

const entryFormHandler = (formDOM) => {

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

	//convert startdate and enddate into moments
	const startMoment = moment.utc(newEntry.startdate)
	const endMoment = moment.utc(newEntry.enddate)
	//store the difference + 1 between start and end as dayCount
	newEntry.dayCount = 1 + endMoment.diff(startMoment, 'days')
	//store startdate as midnight UTC Date object in basedate
	newEntry.basedate = startMoment.toDate()

	//console.log(newEntry);

	remoteData.Dates.createWithDays(newEntry)
		//.then(x => remoteData.Dates.loadList(true)
			//.then(result => x.data))
			/*
		.then(res => {
		    console.log('createDates.jsx create loadList newDate')
		    console.log(res)
		    return res
		})
		*/
		.then(newDate => newDate.festival && m.route.set('/fests/pregame/' + newDate.festival) || console.log('newDate', newDate) && false || m.route.set('/admin'))

		.catch(err => {
			console.log('createDates.jsx create err')
			console.log(err)
		});

	formDOM.reset();
};

const consoleLog = str => console.log(str)
const previousVenueIds = _.memoize(festivalId => remoteData.Series.getVenueIds(remoteData.Festivals.getSeriesId(festivalId)))

const CreateDate = (auth) => { 
	let festivalId = parseInt(m.route.param('festivalId'), 10)
	return {
	oninit: ({attrs}) => {
		festivalId = parseInt(m.route.param('festivalId'), 10)
		if (attrs.titleSet) attrs.titleSet(`Add Date`)
	},
	view: (vnode) => <div class="main-stage">
				<div class="main-stage-content-scroll">
					
    
    <form name="entry-form" id="entry-form" >
      <label for="festival">
        {`Festival`}
      </label>
	      <select id="festival" name="festival" onchange={e => {
	      	festivalId = parseInt(e.target.value, 10)
	      }}>
      	{
	      	remoteData.Festivals.getEventNamesWithIds()
		  		.map(s => <option value={s[1]} selected={festivalId === s[1]}>
		  			{s[0]}
		  		</option>)
  		}
      </select>
      <label for="venue">
        {`Venue`}
        <button onclick={e => {e.preventDefault();m.route.set('/venues/pregame/new');}}>New venue</button>
      </label>
	      <select id="venue" name="venue">
      		{remoteData.Venues.getPlaceNamesWithIds()
      			.sort((a, b) => {
      				if(!festivalId) return 0
      				return previousVenueIds(festivalId).indexOf(b[1]) - previousVenueIds(festivalId).indexOf(a[1])
      			})
	      		.map(s => <option value={s[1]}>{s[0]}</option>)
	      	}
      </select>
      <label for="event-name">
        {`Date Name (City name for travelling fests; Weekend # for stationary)`}
      </label>
      <input id="event-name" type="text" name="name" />
      <label for="event-start">
        {`Start Date`}
      </label>
      <input id="event-start" type="date" name="startdate" />
      <label for="event-end">
        {`End Date (same as start date for single day festival)`}
      </label>
      <input id="event-end" type="date" name="enddate" />
	    <UIButton action={() => entryFormHandler(document.getElementById('entry-form'))} buttonName="SAVE" />
	  </form>
	  </div>
	  </div>
    
}}
export default CreateDate;
