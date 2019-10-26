// profile.js

import DataList from '../DataList'

function ProfileList(opt = {fieldName: 'Profiles'}) {
  DataList.call(this, opt)
  this.core = false
  this.subjectType = 1
}
ProfileList.prototype = Object.create(DataList.prototype)

export default ProfileList