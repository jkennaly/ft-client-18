// artistGenre.js

import DataList from '../DataList'

function ArtistGenreList(opt = {fieldName: 'ArtistGenres'}) {
  DataList.call(this, opt)
}


ArtistGenreList.prototype = Object.create(DataList.prototype)

export default ArtistGenreList