// src/components/fields/ArtistNameField.js
//attrs: artistId

import m from 'mithril'
////import _ from 'lodash'

import { remoteData } from '../../store/data';

const getArtistName = id => {
	const artist = remoteData.Artists.get(id)
	if (!artist) return ''
	return artist.name
}

const ArtistNameField = {
	view: ({ attrs }) =>
		<span class="ft-name-field">
			{(getArtistName(attrs.artistId))}
		</span >
};

export default ArtistNameField;