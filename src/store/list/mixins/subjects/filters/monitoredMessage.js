// message.js
import {timeStampSort} from '../services/sorts.js'

export default (monitors) => { return  {
		recentDiscussionAll (viewer) {return this.list
			.filter(m => !viewer || viewer !== m.fromuser)
			.filter(m => m.messageType === 8 || m.messageType === 1)
			.filter(m => monitors.unread(m.id))
			.sort(timeStampSort)},
		
}