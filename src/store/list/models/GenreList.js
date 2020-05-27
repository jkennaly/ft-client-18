// genre.js

import DataList from '../DataList'

function GenreList(opt = {fieldName: 'Genres'}) {
  DataList.call(this, opt)
}

GenreList.prototype = Object.create(DataList.prototype)

export default GenreList