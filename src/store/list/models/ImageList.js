// image.js

import DataList from '../DataList'

function ImageList(opt = {fieldName: 'Images'}) {
  DataList.call(this, opt)
}


ImageList.prototype = Object.create(DataList.prototype)

export default ImageList