// venue.js

import DataList from '../DataList'

function VenueList(opt = {fieldName: 'Venues'}) {
  DataList.call(this, opt)
  this.subjectType = 5
}
VenueList.prototype = Object.create(DataList.prototype)

export default VenueList