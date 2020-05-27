// messagesMonitor.js

import DataList from '../DataList'

function MessagesMonitorList(opt = {fieldName: 'MessagesMonitors', remoteInterval: 10}) {
  DataList.call(this, opt)
  this.core = false
}
MessagesMonitorList.prototype = Object.create(DataList.prototype)

export default MessagesMonitorList