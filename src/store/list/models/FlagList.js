// src/store/list/models/FlagList.js

import DataList from '../DataList'

function FlagList(opt = {fieldName: 'Flags'}) {
  DataList.call(this, opt)
  this.core = false
  this.subjectType = 13
  this.idField = 'flag'
}
FlagList.prototype = Object.create(DataList.prototype)

export default FlagList