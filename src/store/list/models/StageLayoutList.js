// stageLayout.js

import DataList from '../DataList'

function StageLayoutList(opt = {fieldName: 'StageLayouts'}) {
  DataList.call(this, opt)
}
StageLayoutList.prototype = Object.create(DataList.prototype)

export default StageLayoutList