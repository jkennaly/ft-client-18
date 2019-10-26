// series.js

import DataList from '../DataList'

function SeriesList(opt = {fieldName: 'Series'}) {
  DataList.call(this, opt)
  this.subjectType = 6
  this.idField = 'series'
}
SeriesList.prototype = Object.create(DataList.prototype)

export default SeriesList