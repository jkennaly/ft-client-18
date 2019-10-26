// set.js

import DataList from '../DataList'

function SetList(opt = {fieldName: 'Sets'}) {
  DataList.call(this, opt)
  this.subjectType = 3
  this.idField = 'bandset'
  this.superField = 'day'
}
SetList.prototype = Object.create(DataList.prototype)

export default SetList