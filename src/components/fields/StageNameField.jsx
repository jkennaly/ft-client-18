// src/components/fields/StageNameField.js
//attrs: stageId

import m from 'mithril'
//import _ from 'lodash'

import { remoteData } from '../../store/data';

const getStageName = id => {
	const stage = remoteData.Places.get(id)
	if (!stage) return ''
	return stage.name
}

const StageNameField = {
	view: ({ attrs }) =>
		<span class="ft-name-field">
			{(getStageName(attrs.stageId))}



		</span >
};

export default StageNameField;