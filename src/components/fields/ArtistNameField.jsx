// ArtistNameField.jsx
//attrs: artistId

const m = require("mithril");
//const _ = require('lodash');

import {remoteData} from '../../store/data';

const getArtistName = id => {
	const artist = remoteData.Artists.get(id)
	if(!artist) return ''
	return artist.name
}

const ArtistNameField = {
	oninit: remoteData.Artists.loadList,
	view: ({ attrs }) =>
		<span class="ft-name-field">
			{(getArtistName(attrs.artistId))}
		</span >
};

export default ArtistNameField;