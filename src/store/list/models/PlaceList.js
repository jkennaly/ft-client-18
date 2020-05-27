// place.js

import DataList from '../DataList'

function PlaceList(opt = {fieldName: 'Places'}) {
  DataList.call(this, opt)
  this.subjectType = 4
}
PlaceList.prototype = Object.create(DataList.prototype)

export default PlaceList