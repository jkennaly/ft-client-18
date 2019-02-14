// subjectCard.js

import m from 'mithril'

import ArtistCard from './ArtistCard.jsx';
import DateCard from './DateCard.jsx';
import DayCard from './DayCard.jsx';
import FestivalCard from './FestivalCard.jsx';
import SeriesCard from './SeriesCard.jsx';
import SetCard from './SetCard.jsx';

import {subjectData} from '../../store/data.js';

//return a card for the subject with all needed attrs set
export const subjectCard = subjectObject => {
	switch(subjectObject.subjectType) {
		case 2: return m(ArtistCard, {data: subjectData.data(subjectObject)});
		default: return '';
	}
}