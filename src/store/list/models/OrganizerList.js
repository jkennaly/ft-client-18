// organizer.js

import DataList from '../DataList'

function OrganizerList(opt = {fieldName: 'Organizers'}) {
  DataList.call(this, opt)
}
OrganizerList.prototype = Object.create(DataList.prototype)

export default OrganizerList