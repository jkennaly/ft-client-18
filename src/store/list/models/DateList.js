// date.js

import DataList from '../DataList'

function DateList(opt = {fieldName: 'Dates'}) {
  DataList.call(this, opt)
  this.subjectType = 8
  this.idField = 'date'
  this.superField = 'festival'
}

DateList.prototype = Object.create(DataList.prototype)

export default DateList