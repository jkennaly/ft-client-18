// SetNameField.jsx
//attrs: 
//	artistName
//	seriesId
//	festivalId

const m = require("mithril");
//const _ = require('lodash');

import  ComposedNameField from './ComposedNameField.jsx';
import  MainEventField from './MainEventField.jsx';

const SetNameField = {
	view: ({ attrs }) =>
		<span class="ft-set-name-field">
	        <ComposedNameField fieldValue={attrs.artistName + ' @'} />
	        <MainEventField seriesId={attrs.seriesId} festivalId={attrs.festivalId} />
		</span >
};

export default SetNameField;