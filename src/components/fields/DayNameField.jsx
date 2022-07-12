// src/components/fields/DayNameField.js
//attrs: dayId

import m from 'mithril'
////import _ from 'lodash'

import { remoteData } from '../../store/data';

const getDayName = id => {
	const day = remoteData.Days.get(id)
	if (!day) return ''
	return day.name
}

const DayNameField = {
	view: ({ attrs }) =>
		<span class="ft-name-field">
			{(getDayName(attrs.dayId))}



		</span >
};

export default DayNameField;