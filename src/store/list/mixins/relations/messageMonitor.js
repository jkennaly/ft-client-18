// messageMonitor.js

import _ from 'lodash'

export default {
	unread (messageId) { 
		return !this.find(v => v.message === messageId)
	},
	markRead (messageId) { 
		const data = {message:messageId}
		//mark locally
		this.list.push(data)
		//send to server
		this.create(data)
	}  
}