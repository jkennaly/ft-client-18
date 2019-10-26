// artistPriority.js


import DataList from '../DataList'

function ArtistPriorityList(opt = {fieldName: 'ArtistPriorities'}) {
  DataList.call(this, opt)
}

ArtistPriorityList.prototype = Object.create(DataList.prototype)

export default ArtistPriorityList