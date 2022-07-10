// src/store/action/messageArrays.js

import m from "mithril"
import _ from "lodash"
import { remoteData } from "../../store/data"
import { subjectData } from "../../store/subjectData"
import globals from "../../services/globals"
const baseFilter = userId => m =>
	m.fromuser !== userId && ![globals.RATING, globals.CHECKIN].includes(m.messageType)
const personalFilter = userId => m =>
	m.fromuser === userId && ![globals.RATING, globals.CHECKIN].includes(m.messageType)

const { Messages: messages } = remoteData

export const remote = {
	unread: attrs => {
		const loopFilter = {
			order: `id DESC`,
			limit: 50,
			skip: 0,
			where: {
				and: [
					{ messageType: { nin: [globals.RATING, globals.CHECKIN] } },
					{ fromuser: { neq: attrs.userId } }
				]
			}
		}
		return Promise.all([
			remoteData.MessagesMonitors.remoteCheck(),
			remoteData.Messages.maintainList(loopFilter)
				.then(() =>
					_.take(
						remoteData.Messages.getFiltered(baseFilter(attrs.userId)).sort(
							(a, b) => b.id - a.id
						),
						50
					)
				)
				.then(baseMessages => {
					Promise.all(baseMessages.map(subjectData.getLocalPromise)).catch(
						console.error
					)
					return baseMessages
				})
				.then(baseMessages =>
					_.uniq(baseMessages.map(x => x.baseMessage || x.id))
				)
				.then(baseIds => {
					return { where: { baseMessage: { inq: baseIds } } }
				})
				.then(discussFilter => remoteData.Messages.maintainList(discussFilter))
				.catch(console.error)
		])
	},
	userRecent: attrs => {
		const loopFilter = {
			order: `id DESC`,
			limit: 50,
			skip: 0,
			where: {
				and: [
					{ messageType: { nin: [globals.RATING, globals.CHECKIN] } },
					{ fromuser: attrs.userId }
				]
			}
		}
		return Promise.all([
			remoteData.MessagesMonitors.remoteCheck(),
			remoteData.Messages.maintainList(loopFilter)
				.then(() =>
					_.take(
						remoteData.Messages.getFiltered(baseFilter(attrs.userId)).sort(
							(a, b) => b.id - a.id
						),
						50
					)
				)
				.then(baseMessages => {
					Promise.all(
						baseMessages.map(m =>
							remoteData.Messages.subjectDetails({
								subjectType: globals.MESSAGE,
								subject: m.id
							})
						)
					).catch(console.error)
					return baseMessages
				})
				/*
				.then(x => {console.log('messageArrays userRecent remote', x);return x;})
				.then(baseMessages => _.uniq(baseMessages.map(x => x.baseMessage || x.id)))
				.then(baseIds => Promise.all(
					baseIds.map(id => remoteData.Messages.getLocalPromise(id))
				))
				.then(baseMessages => Promise.all([
					...baseMessages.map(m => console.log('userRecent baseMessage', m) || subjectData.getLocalPromise(m)),
					remoteData.Messages.maintainList({where: {id: {inq: baseMessages.map(x => x.id)}}})
				]))
				*/
				//.then(discussFilter => remoteData.Messages.maintainList(discussFilter))
				.catch(console.error)
		])
	},
	flags: attrs => {
		//console.log('messageArrays remote flags', attrs)
		return Promise.all([
			remoteData.MessagesMonitors.remoteCheck(true),
			remoteData.Flags.remoteCheck(true)
				.then(() =>
					Promise.all(
						_.map(remoteData.Flags.list, f =>
							remoteData.Flags.subjectDetails({
								subjectType: globals.FLAG,
								subject: f.id
							})
						)
					)
				)
				.catch(console.error)
		])
	},
	related: attrs => {
		const loopFilter = {
			order: `id DESC`,
			limit: 50,
			skip: 0,
			where: {
				or: [{ id: attrs.messageId }, { baseMessage: attrs.messageId }]
			}
		}
		return Promise.all([remoteData.Messages.maintainList(loopFilter)]).catch(
			console.error
		)
	}
}

export const related = (userId, userRoles, id) => {
	const msg = messages.get(id)
	if (!msg) return []
	const bmi = msg.baseMessage ? msg.baseMessage : msg.id
	const baseMessage = msg && bmi ? messages.get(bmi) : msg
	const childMessages = messages.getFiltered({ baseMessage: bmi })
	return [[baseMessage, ...childMessages]]
}

export const unread = userId =>
	_.uniq(
		remoteData.Messages.getFiltered(baseFilter(userId)).map(
			x => x.baseMessage || x.id
		)
	)
		//.map(x => {console.log('DiscussionPane hs', x);return x;})
		.map(id => {
			return m => m.id === id || m.baseMessage === id
		})
		.map(discussFilter => remoteData.Messages.getFiltered(discussFilter))
		.filter(discussion =>
			discussion.some(
				m => m.fromuser !== userId && remoteData.MessagesMonitors.unread(m.id)
			)
		)

export const userRecent = userId =>
	_.uniq(
		remoteData.Messages.getFiltered(personalFilter(userId)).map(
			x => x.baseMessage || x.id
		)
	)
		//.map(x => {console.log('DiscussionPane hs', x);return x;})
		.map(id => {
			return m => m.id === id || m.baseMessage === id
		})
		.map(discussFilter => remoteData.Messages.getFiltered(discussFilter))
		.filter(discussion => !discussion.some(x => x.subjectType === globals.FLAG))

export const flags = (userId, userRoles) => {
	const pending = remoteData.Flags.pending([userId, userRoles])
	const waiting = remoteData.Flags.waiting([userId, userRoles])
	return [...pending, ...waiting]
		.map(f => [
			f,
			...remoteData.Messages.getFiltered({ subjectType: globals.FLAG, subject: f.id })
		])
		.map(([f, ...ma]) => [f, ...ma.map(m => m.id)])
		.map(([f, ...ids]) => {
			return [f, m => ids.includes(m.id) || ids.includes(m.baseMessage)]
		})
		.map(([f, discussFilter]) => [
			f,
			...remoteData.Messages.getFiltered(discussFilter)
		])
		.map(x => {
			//console.log("DiscussionPane hs", x)
			return x
		})
	//.filter(discussion => discussion.some(m => m.fromuser !== userId && remoteData.MessagesMonitors.unread(m.id)))
	//resetSelector('#date')
}
