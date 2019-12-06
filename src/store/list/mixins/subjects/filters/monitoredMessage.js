// monitoredMessage.js

export default (monitors) => { return  {
		recentDiscussionAll (viewer) {return this
			.getFiltered(m => (!viewer || viewer !== m.fromuser) && (m.messageType === 8 || m.messageType === 1))
			.filter(m => monitors.unread(m.id))
		},
		getUnread (filter, viewer) {
			const baseMessages = this.getFiltered(filter)
			const baseIds = baseMessages.map(x => x.id)
			const discussMessages = this.getFiltered(f => f.baseMessage && baseIds.includes(f.baseMessage))
			return [...baseMessages, ...discussMessages]
				.filter(m => (!viewer || viewer !== m.fromuser))
				.filter(m => monitors.unread(m.id))
		}
		
}}