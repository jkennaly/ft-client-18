// fieldSelecter.js

import m from 'mithril'
//import _ from 'lodash'

import {remoteData} from './data';

const fieldSelecter = {
	artistName: artistId => remoteData.Artists.getName(artistId),
	averageSetRating: setId => remoteData.Messages.setAverageRating(setId),
	seriesName: (eventId, eventDataType) => remoteData[eventDataType].getSeriesId(eventId)
}

export default fieldSelecter