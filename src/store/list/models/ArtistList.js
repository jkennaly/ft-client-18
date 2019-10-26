// artist.js

import DataList from '../DataList'

function ArtistList(opt = {fieldName: 'Artists'}) {
	DataList.call(this, opt)
	this.subjectType = 2
}

ArtistList.prototype = Object.create(DataList.prototype)



export default ArtistList