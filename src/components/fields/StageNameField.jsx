// StageNameField.jsx
//attrs: stageId

const m = require("mithril");
const _ = require('lodash');

import {remoteData} from '../../store/data';

const getStageName = id => {
	const stage = remoteData.Places.get(id)
	if(!stage) return ''
	return stage.name
}

const StageNameField = {
	oninit: remoteData.Places.loadList,
	view: ({ attrs }) =>
		<span class="ft-name-field">
			{(getStageName(attrs.stageId))}
			
		
		
		</span >
};

export default StageNameField;