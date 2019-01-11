// createVenue.jsx


import m from 'mithril'
import _ from 'lodash'

import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min'

import DetailBanner from '../../ui/DetailBanner.jsx';
import CardContainer from '../../../components/layout/CardContainer.jsx';

import LauncherBanner from '../../../components/ui/LauncherBanner.jsx';

import {remoteData} from '../../../store/data';

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

	console.log(newEntry);


	const submit = remoteData.Venues.create(newEntry)
		.then(() => formDOM.reset())

	
};

const consoleLog = str => console.log(str)

var userId = 0

const CreateVenue = (auth) => { return {
	oninit: () => {
		remoteData.Venues.loadList()
		auth.getFtUserId()
			.then(id => userId = id)
			.then(() => m.redraw())
			.catch(err => console.log(err))
	},
	view: (vnode) => <div class="main-stage">
      <LauncherBanner 
        title="Create new Venue"
      />
    <form name="entry-form" id="entry-form" class="{userId > 0 ? '' : 'hidden' }">
      <label for="venue-name">
        {`Venue Name`}
      </label>
      <input id="venue-name" type="text" name="name" />
      <label for="description">
        {`Description`}
      </label>
      <input id="description" type="text" name="description" />
      <label for="timezone">
        {`Timezone`}
      </label>
      <select id="timezone" name="timezone">
      	   	{moment.tz.names()
	      		.map(s => <option value={s}>{s}</option>)
	      	}
      </select>
      <label for="country">
        {`Country`}
      </label>
      <input id="country" type="text" name="country" />
      <label for="state">
        {`State`}
      </label>
      <input id="state" type="text" name="state" />
      <label for="city">
        {`City`}
      </label>
      <input id="city" type="text" name="city" />
      <label for="street-address">
        {`Street Address`}
      </label>
      <input id="street-address" type="text" name="streetAddress" />
	    <UIButton action={() => entryFormHandler(document.getElementById('entry-form'), userId)} buttonName="SAVE" />
	  </form>
    </div>
    
}}
export default CreateVenue;
