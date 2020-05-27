// image.js

import DataList from '../DataList'

function ImageList(opt = {fieldName: 'Images'}) {
  DataList.call(this, opt)
  this.subjectType = 12
  this.idField = 'image'
}


ImageList.prototype = Object.create(DataList.prototype)

export default ImageList