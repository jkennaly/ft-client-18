// festival.js

import DataList from '../DataList'

function FestivalList(opt = {fieldName: 'Festivals'}) {
  DataList.call(this, opt)
  this.subjectType = 7
  this.idField = 'festival'
  this.nameField = 'year'
  this.superField = 'series'
}

FestivalList.prototype = Object.create(DataList.prototype)

export default FestivalList