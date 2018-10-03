// createSeries.jsx


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

	newEntry.user = userId

	console.log(newEntry);

	newEntry["favorite"] = false;
	newEntry["CFPCompleted"] = newEntry.CFP ? false : "null";

	remoteData.Series.create(newEntry);

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
			.catch(err => console.log(err))
	},
	view: (vnode) =>
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
	    <UIButton action={() => entryFormHandler(vnode.dom, userId)} buttonName="SAVE" />
	  </form>
    
}}
export default CreateSeries;
