// createDate.jsx


import m from 'mithril'
import _ from 'lodash'

import moment from 'moment-timezone';

import DetailBanner from '../../ui/DetailBanner.jsx';
import CardContainer from '../../../components/layout/CardContainer.jsx';
import DateCard from '../../../components/cards/DateCard.jsx';

import LauncherBanner from '../../../components/ui/LauncherBanner.jsx';

import {remoteData} from '../../../store/data';

import SeriesDescriptionField from '../../detailViewsPregame/fields/series/SeriesDescriptionField.jsx'
import SeriesWebsiteField from '../../detailViewsPregame/fields/series/SeriesWebsiteField.jsx'

import {setMockData} from "../../../store/data";
import UIButton from '../../ui/UIButton.jsx';

const entryFormHandler = (formDOM, userId) => {

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

	newEntry.user = userId

	//convert startdate and enddate into moments
	const startMoment = moment.utc(newEntry.startdate)
	const endMoment = moment.utc(newEntry.enddate)
	//store the difference + 1 between start and end as dayCount
	newEntry.dayCount = 1 + endMoment.diff(startMoment, 'days')
	//store startdate as midnight UTC Date object in basedate
	newEntry.basedate = startMoment.toDate()

	console.log(newEntry);

	remoteData.Dates.createWithDays(newEntry);

	formDOM.reset();
};

const consoleLog = str => console.log(str)

var userId = 0

const CreateDate = (auth) => { return {
	oninit: () => {
		remoteData.Series.loadList()
		remoteData.Festivals.loadList()
		remoteData.Dates.loadList()
		remoteData.Venues.loadList()
		auth.getFtUserId()
			.then(id => userId = id)
			.then(() => m.redraw())
				.catch(err => m.route.set('/auth'))
	},
	view: (vnode) => <div class="main-stage">
			<LauncherBanner 
				title="Add date"
			/>
    
    <form name="entry-form" id="entry-form" class="{userId > 0 ? '' : 'hidden' }">
      <label for="festival">
        {`Festival`}
      </label>
	      <select id="festival" name="festival">
      {parseInt(m.route.param('festivalId'), 10) ?
	      	<option value={parseInt(m.route.param('festivalId'), 10)}>{remoteData.Festivals.getEventName(parseInt(m.route.param('festivalId'), 10))}</option> :
	      	remoteData.Festivals.getEventNamesWithIds()
	      		.map(s => <option value={s[1]}>{s[0]}</option>)
	      	}
      </select>
      <label for="venue">
        {`Venue`}
        <button onclick={() => m.route.set('/venues/pregame/new')}>New venue</button>
      </label>
	      <select id="venue" name="venue">
      		{remoteData.Venues.getPlaceNamesWithIds()
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
	    <UIButton action={() => entryFormHandler(document.getElementById('entry-form'), userId)} buttonName="SAVE" />
	  </form>
	  </div>
    
}}
export default CreateDate;
