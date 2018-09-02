// fieldSelecter.js

const m = require("mithril");
const _ = require('lodash');

import {remoteData} from './data';

const fieldSelecter = {
	artistName: artistId => remoteData.Artists.getName(artistId),
	averageSetRating: setId => remoteData.Messages.setAverageRating(setId),
	seriesName: (eventId, eventDataType) => remoteData[eventDataType].getSeriesId(eventId)
}

export default fieldSelecter