// messagesMonitor.js

import _ from 'lodash'

export default {
	unread (id) { 
		return _.every(this.list, v => v.message !== id)
	}  
}