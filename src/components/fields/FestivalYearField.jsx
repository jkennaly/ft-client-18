// src/components/fields/FestivalYearField.jsx
//attrs: festivalId

import m from 'mithril'
////import _ from 'lodash'

import {remoteData} from '../../store/data';

const getFestivalYear = id => {
	const festival = remoteData.Festivals.get(id)
	if(!festival) return ''
	return festival.year
}

const FestivalYearField = {
	view: ({ attrs }) =>
		<span class="ft-name-field">
			{(getFestivalYear(attrs.festivalId))}
		</span >
};

export default FestivalYearField;