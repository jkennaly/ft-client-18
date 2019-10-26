// placeType.js

import DataList from '../DataList'

function PlaceTypeList(opt = {fieldName: 'PlaceTypes'}) {
  DataList.call(this, opt)
}
PlaceTypeList.prototype = Object.create(DataList.prototype)

export default PlaceTypeList