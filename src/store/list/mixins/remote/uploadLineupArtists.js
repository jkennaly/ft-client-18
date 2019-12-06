// src/store/list/mixins/remote/uploadLineupArtists.js

import provide from '../../../loading/provide'

export default (artists) => {return {
	upload (data, festivalId) { 
		const end = `/api/Artists/festivalLineup/${festivalId}`
		console.log('upload artists', data, ...data.keys(), ...data.values())
		
		return provide(data, this.fieldName, '', end, undefined, undefined, {form: true})
			//.then(c => {console.log('upload response', c); return c})
			.catch(console.error)
			.then(() => this.acquireListSupplement('filter=' + JSON.stringify({where: {festival: festivalId}})))
			.then(() => Promise.all(this.getFiltered({festival: festivalId}).map(x => x.band).map(id => artists.getLocalPromise(id))))
	},
	addArtist (data, festivalId) {
		const end = '/api/Artists/addToLineup/' + festivalId
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