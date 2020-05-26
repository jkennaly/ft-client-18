// src/store/action/messageArrays.js

import m from 'mithril'
import _ from 'lodash'
import {remoteData} from '../../store/data';
import {subjectData} from '../../store/subjectData'
const baseFilter = (userId) => m => m.fromuser !== userId && ![RATING, CHECKIN].includes(m.messageType)
const personalFilter = (userId) => m => m.fromuser === userId && ![RATING, CHECKIN].includes(m.messageType)

export const remote = {
	unread: (attrs) => {
		const loopFilter = {
				order: `id DESC`, 
				limit: 50, 
				skip: 0,
				where: {
					and: [
						{messageType: {nin: [RATING, CHECKIN]}},
						{fromuser: {neq: attrs.userId}}
					]
				}
			}
			return Promise.all([
				remoteData.MessagesMonitors.remoteCheck(),
				remoteData.Messages.maintainList(loopFilter)
				.then(() => _.take(remoteData.Messages.getFiltered(baseFilter(attrs.userId)).sort((a, b) => b.id - a.id), 50))
				.then(baseMessages => {
					Promise.all(baseMessages.map(subjectData.getLocalPromise))
						.catch(console.error)
					return baseMessages
				})
				.then(baseMessages => _.uniq(baseMessages.map(x => x.baseMessage || x.id)))
				.then(baseIds => {return {where: {baseMessage: {inq: baseIds}}}})
				.then(discussFilter => remoteData.Messages.maintainList(discussFilter))
				.catch(console.error)
			])
			
		},
	userRecent: (attrs) => {
		const loopFilter = {
				order: `id DESC`, 
				limit: 50, 
				skip: 0,
				where: {
					and: [
						{messageType: {nin: [RATING, CHECKIN]}},
						{fromuser: attrs.userId}
					]
				}
			}
			return Promise.all([
				remoteData.MessagesMonitors.remoteCheck(),
				remoteData.Messages.maintainList(loopFilter)
				.then(() => _.take(remoteData.Messages.getFiltered(baseFilter(attrs.userId)).sort((a, b) => b.id - a.id), 50))
				.then(baseMessages => {
					Promise.all(baseMessages.map(m => remoteData.Messages.subjectDetails({subjectType: MESSAGE, subject: m.id})))
						.catch(console.error)
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
		flags: (attrs) => {
			//console.log('messageArrays remote flags', attrs)
			return Promise.all([
				remoteData.MessagesMonitors.remoteCheck(true),
				remoteData.Flags.remoteCheck(true)
					.then(() => Promise.all(_.map(remoteData.Flags.list, f => remoteData.Flags.subjectDetails({subjectType: FLAG, subject:f.id}))))
					.catch(console.error)
			])
			
		}
}

export const unread = (userId) => _.uniq(remoteData.Messages.getFiltered(baseFilter(userId))
	.map(x => x.baseMessage || x.id))
	//.map(x => {console.log('DiscussionPane hs', x);return x;})
	.map(id => {return m => m.id === id || m.baseMessage === id})
	.map(discussFilter => remoteData.Messages.getFiltered(discussFilter))
	.filter(discussion => discussion.some(m => m.fromuser !== userId && remoteData.MessagesMonitors.unread(m.id)))


export const userRecent = (userId) => _.uniq(remoteData.Messages.getFiltered(personalFilter(userId))
	.map(x => x.baseMessage || x.id))
	//.map(x => {console.log('DiscussionPane hs', x);return x;})
	.map(id => {return m => m.id === id || m.baseMessage === id})
	.map(discussFilter => remoteData.Messages.getFiltered(discussFilter))
	//.map(discussion => _.some(discussion, m => m.subjectType === FLAG) ? [remoteData.Flags.get(_.get(_.find(discussion, m => m.subjectType === FLAG), 'subject', 0)), ...discussion] : discussion)
	.filter(discussion => !discussion.some(x => x.subjectType === FLAG))


export const flags = (userId, userRoles) => {
	const pending = remoteData.Flags.pending([userId, userRoles])
	const waiting = remoteData.Flags.waiting([userId, userRoles])	
	return [...pending, ...waiting]
		.map(f => [f, ...remoteData.Messages.getFiltered({subjectType: FLAG, subject: f.id})])
		.map(([f, ...ma]) => [f, ...ma.map(m => m.id)])
		//.map(x => {console.log('DiscussionPane hs', x);return x;})
		.map(([f, ...ids]) => {return [f, m => ids.includes(m.id) || ids.includes(m.baseMessage)]})
		.map(([f, discussFilter]) => [f, ...remoteData.Messages.getFiltered(discussFilter)])
		//.filter(discussion => discussion.some(m => m.fromuser !== userId && remoteData.MessagesMonitors.unread(m.id)))
	//resetSelector('#date')
}