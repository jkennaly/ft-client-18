// createSeries.jsx


import m from 'mithril'
import _ from 'lodash'

import DetailBanner from '../../ui/DetailBanner.jsx';
import CardContainer from '../../../components/layout/CardContainer.jsx';
import FestivalCard from '../../../components/cards/FestivalCard.jsx';

import LauncherBanner from '../../../components/ui/LauncherBanner.jsx';

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

	remoteData.Series.create(newEntry)
		.then(x => remoteData.Series.loadList(true)
			.then(result => x))
		.then(newSeries => m.route.set('/series/pregame/' + newSeries.id))
		.catch(err => {
			console.log('createSeries.jsx create err')
			console.log(err)
		})

	formDOM.reset();
};

const consoleLog = str => console.log(str)

var userId = 0

const CreateSeries = (auth) => { return {
	oninit: () => {
		remoteData.Series.loadList()
		auth.getFtUserId()
			.then(id => userId = id)
			.then(() => m.redraw())
				.catch(err => m.route.set('/auth'))
	},
	view: (vnode) => <div class="main-stage">
			<LauncherBanner 
				title="Create series"
			/>
				<div class="main-stage-content-scroll">
    <form name="entry-form" id="entry-form" class="{userId > 0 ? '' : 'hidden' }">
      <label for="series-name">
        {`Series Name`}
      </label>
      <input id="series-name" type="text" name="name" />
      <label for="description">
        {`Description`}
      </label>
      <input id="description" type="text" name="description" />
      <label for="website">
        {`Website`}
      </label>
      <input id="website" type="text" name="website" />
	    <UIButton action={() => entryFormHandler(document.getElementById('entry-form'))} buttonName="SAVE" />
	  </form>
	  </div>
	  </div>
    
}}
export default CreateSeries;
