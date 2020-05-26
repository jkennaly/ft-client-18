// img.js
import _ from 'lodash'

export default {
	getTitle(id) {return this.get(id).title},
		getSrc(id) {return this.get(id).url},
		getAttributionAr(id) {
			const el = this.get(id)
			return el ? [el.title, el.sourceUrl, el.author, el.license, el.licenseUrl] : []
		},
		getName(id) {return this.getTitle(id)},
		forArtist (artistId) {return this.list
			.filter(m => (m.subjectType === 2) && (m.subject === artistId))},

}