// uploadLineupArtists.js

import provide from '../../../loading/provide'

export default (artists) => {return {
	upload (data, festivalId) { 
		const end = `/api/Artists/festivalLineup/${festivalId}`
			//console.log('upload artists')
			//console.log(data)
			return provide(data, this.fieldName, '', end)
				.then(() => artists.remoteCheck(true))
				.then(() => this.remoteCheck(true))
	},
	addArtist (data, festivalId) {
		const dataFieldName = 'Artists/addToLineup/' + festivalId
		//((assume data was validated in form))
		//((assume server will add user field))
		//submit to server
		//set last remote load to 0
		return provide(data, this.fieldName, '', end)
			.then(artistData => {
				//console.log('artistData')
				//console.log(artistData)
				artists.append(artistData.id.artist)
				this.append(artistData.id.lineup)
				//m.redraw()
				return artistData
			})
			//.then(logResult)
				.then(() => artists.remoteCheck(true))
				.then(() => this.remoteCheck(true))
	}
}}