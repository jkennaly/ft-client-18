// createFestival.jsx


const m = require("mithril");
const _ = require("lodash");

import DetailBanner from '../../ui/DetailBanner.jsx';
import CardContainer from '../../../components/layout/CardContainer.jsx';
import FestivalCard from '../../../components/cards/FestivalCard.jsx';

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

	newEntry.creator = userId

	//console.log(newEntry);

	remoteData.Festivals.create(newEntry);

	formDOM.reset();
};

const consoleLog = str => console.log(str)

var userId = 0

const CreateFestival = (auth) => { return {
	oninit: () => {
		remoteData.Series.loadList()
		remoteData.Festivals.loadList()
		auth.getFtUserId()
			.then(id => userId = id)
			.then(() => m.redraw())
			.catch(err => console.log(err))
	},
	view: (vnode) =>
    <form name="entry-form" id="entry-form" class="{userId > 0 ? '' : 'hidden' }">
      <label for="series">
        {`Festival Series`}
      </label>
	      <select id="series" name="series">
      {parseInt(m.route.param('seriesId'), 10) ?
	      	<option value={parseInt(m.route.param('seriesId'), 10)}>{remoteData.Series.getEventName(parseInt(m.route.param('seriesId'), 10))}</option> :
	      	remoteData.Series.getEventNamesWithIds()
	      		.map(s => <option value={s[1]}>{s[0]}</option>)
	      	}
      </select>
      <label for="event-name">
        {`Festival Year`}
      </label>
      <input id="event-name" type="text" name="year" />
	    <UIButton action={() => entryFormHandler(vnode.dom, userId)} buttonName="SAVE" />
	  </form>
    
}}
export default CreateFestival;
