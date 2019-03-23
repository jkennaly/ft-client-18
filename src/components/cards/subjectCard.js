// subjectCard.js

import m from 'mithril'
import _ from 'lodash'

import ArtistCard from './ArtistCard.jsx';
import DateCard from './DateCard.jsx';
import DayCard from './DayCard.jsx';
import FestivalCard from './FestivalCard.jsx';
import PlaceCard from './PlaceCard.jsx';
import SeriesCard from './SeriesCard.jsx';
import SetCard from './SetCard.jsx';
import UserCard from './UserCard.jsx';

import {subjectData} from '../../store/subjectData.js';

//return a card for the subject with all needed attrs set
export const subjectCard = (subjectObject, otherAttrs) => {
			//console.log('subjectCard subjectObject', subjectObject)
	switch(subjectObject.subjectType) {
		case 4: return m(PlaceCard, _.assign({subjectObject: subjectObject}, otherAttrs));
		case 3: return m(SetCard, _.assign({subjectObject: subjectObject}, otherAttrs));
		case 2: return m(ArtistCard, _.assign({data: subjectData.data(subjectObject)}, otherAttrs));
		case 1: return m(UserCard, _.assign({subjectObject: subjectObject}, otherAttrs));
		default: return '';
	}
}