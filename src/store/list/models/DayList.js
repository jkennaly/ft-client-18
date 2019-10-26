// day.js

import DataList from '../DataList'

function DayList(opt = {fieldName: 'Days'}) {
  DataList.call(this, opt)
  this.subjectType = 9
  this.idField = 'day'
  this.superField = 'date'
}

DayList.prototype = Object.create(DataList.prototype)

export default DayList