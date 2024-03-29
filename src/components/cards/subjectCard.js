// src/components/cards/subjectCard.js

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
import ActivityCard from './ActivityCard.jsx';
import FlagCard from './FlagCard.jsx';
import ImageCard from './ImageCard.jsx';

import { subjectData } from '../../store/subjectData.js';
import globals from "../../services/globals"

//return a card for the subject with all needed attrs set
export const subjectCard = (subjectObject, otherAttrs) => {
	//console.log('subjectCard subjectObject', subjectObject)
	switch (subjectObject.subjectType) {
		case globals.FLAG: return m(FlagCard, _.assign({ subjectObject: subjectObject }, otherAttrs));
		case globals.IMAGE: return m(ImageCard, _.assign({ subjectObject: subjectObject }, { image: subjectData.get(subjectObject) }));
		//case globals.11: return m(SiteCard, _.assign({subjectObject: subjectObject}, otherAttrs));
		case globals.MESSAGE: return m(MessageCard, _.assign({ subjectObject: subjectObject }, otherAttrs));
		case globals.DAY: return m(DayCard, _.assign({ subjectObject: subjectObject }, otherAttrs));
		case globals.DATE: return m(DateCard, _.assign({ subjectObject: subjectObject }, otherAttrs));
		case globals.FESTIVAL: return m(FestivalCard, _.assign({ subjectObject: subjectObject }, otherAttrs));
		case globals.SERIES: return m(SeriesCard, _.assign({ subjectObject: subjectObject }, otherAttrs));
		//case globals.5: return m(VenueCard, _.assign({subjectObject: subjectObject}, otherAttrs));
		case globals.PLACE: return m(PlaceCard, _.assign({ subjectObject: subjectObject }, otherAttrs));
		case globals.SET: return m(SetCard, _.assign({ subjectObject: subjectObject }, otherAttrs));
		case globals.ARTIST: return m(ArtistCard, _.assign({ subjectObject: subjectObject }, { data: subjectData.get(subjectObject) }, otherAttrs));
		case globals.USER: return m(UserCard, _.assign({ subjectObject: subjectObject }, otherAttrs));
		default: return '';
	}
}