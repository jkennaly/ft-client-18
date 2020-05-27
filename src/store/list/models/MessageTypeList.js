// MessageTypeList.js

import DataList from '../DataList'

function MessageTypeList(opt = {fieldName: 'MessageTypes'}) {
  DataList.call(this, opt)
}
MessageTypeList.prototype = Object.create(DataList.prototype)

export default MessageTypeList