// stagePriority.js

import DataList from '../DataList'

function StagePriorityList(opt = {fieldName: 'StagePriorities'}) {
  DataList.call(this, opt)
}
StagePriorityList.prototype = Object.create(DataList.prototype)

export default StagePriorityList