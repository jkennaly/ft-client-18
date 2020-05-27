// artistAlias.js

import DataList from '../DataList'

function ArtistAliasList(opt = {fieldName: 'ArtistAliases'}) {
  DataList.call(this, opt)
}

ArtistAliasList.prototype = Object.create(DataList.prototype)

export default ArtistAliasList