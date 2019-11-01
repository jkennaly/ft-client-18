// forArtist.js

import _ from 'lodash'

export default {
	forArtist (artistId) { 
		return this.list
			.filter(d => d.band === artistId)
	}  
}