// message.js

import DataList from '../DataList'

function MessageList(opt = {
	fieldName: 'Messages',
	remoteInterval: 10
	}) {
  DataList.call(this, opt)
  this.core = false
  this.subjectType = 10
}
MessageList.prototype = Object.create(DataList.prototype)

export default MessageList