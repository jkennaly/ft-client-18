// src/store/list/mixins/attributes/pending.js
import _ from 'lodash'
import globals from "../../../../services/globals"

export default (messages) => {
	return {
		pending([userId, userRoles]) {
			//for users, pending flags have states of: 3 (Responded) or 5 (Discussion) if they have an unread reply
			//for admin, pending flags have a state of 1 (Opened) or 2 (Review) or 5 (Discussion)  if they have an unread reply
			const userPending = userId && userRoles.includes(`user`) ? this.getFiltered(f => f.fromuser === userId && [3, 5].includes(f.status)) : []
			const userPendingAction = userPending.filter(f => f.status === 3 || messages.getUnread({ subjectType: globals.FLAG, subject: f.id }, userId).length)
			const adminPending = userId && userRoles.includes(`admin`) ? this.getFiltered(f => [1, 2, 5].includes(f.status)) : []
			const adminPendingAction = adminPending.filter(f => [1, 2].includes(f.status) || messages.getUnread({ subjectType: globals.FLAG, subject: f.id }, userId).length)
			//console.log('pending userPending, adminPending', userPending, adminPending)
			//console.log('pending userId, userRoles', userId, userRoles)
			return [...userPendingAction, ...adminPendingAction]
		},
		waiting([userId, userRoles]) {
			//for users, pending flags have states of: 3 (Responded) or 5 (Discussion) if they have an unread reply
			//for admin, pending flags have a state of 1 (Opened) or 2 (Review) or 5 (Discussion)  if they have an unread reply
			const userWating = userId && userRoles.includes(`user`) ? this.getFiltered(f => f.fromuser === userId && [1, 2, 4, 5, 6].includes(f.status)) : []
			const userWatingAction = userWating.filter(f => f.status !== 5 || !messages.getUnread({ subjectType: globals.FLAG, subject: f.id }, userId).length)
			const adminWating = userId && userRoles.includes(`admin`) ? this.getFiltered(f => [3, 4, 5, 6].includes(f.status)) : []
			const adminWatingAction = adminWating.filter(f => f.status !== 5 || !messages.getUnread({ subjectType: globals.FLAG, subject: f.id }, userId).length)
			//console.log('pending userWating, adminWating', userWating, adminWating)
			//console.log('pending userId, userRoles', userId, userRoles)
			return [...userWatingAction, ...adminWatingAction]
		}
	}
}