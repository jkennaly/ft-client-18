// parentGenre.js

import DataList from '../DataList'

function ParentGenreList(opt = {fieldName: 'ParentGenres'}) {
  DataList.call(this, opt)
}
ParentGenreList.prototype = Object.create(DataList.prototype)

export default ParentGenreList