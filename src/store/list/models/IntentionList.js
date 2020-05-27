// intention.js

import DataList from '../DataList'

function IntentionList(opt = {fieldName: 'Intentions'}) {
  DataList.call(this, opt)
  this.core = false
}
IntentionList.prototype = Object.create(DataList.prototype)

export default IntentionList