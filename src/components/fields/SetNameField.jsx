// src/components/fields/SetNameField.js
//attrs: 
//	artistName
//	seriesId
//	festivalId

import m from 'mithril'
////import _ from 'lodash'

import ComposedNameField from './ComposedNameField.js';
import MainEventField from './MainEventField.jsx';

const SetNameField = {
	view: ({ attrs }) =>
		<span class="ft-set-name-field">
			<ComposedNameField fieldValue={attrs.artistName + ' @'} />
			<MainEventField seriesId={attrs.seriesId} festivalId={attrs.festivalId} />
		</span >
};

export default SetNameField;