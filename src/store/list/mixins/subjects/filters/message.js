// message.js
import _ from 'lodash'
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min'

import {timeStampSort} from '../../../../../services/sorts.js'


const simpleDate = str => moment(str, 'YYYY-MM-DD', true).isValid()

const researchApplicable = (content, opt) => {
	if(!content) return true
	if(simpleDate(content)) return moment().isSameOrBefore(moment(content, 'YYYY-MM-DD', true), 'day')
	//if content starts with 'fest' and opt.festival is defined then parse the festivalId
	const optFest = opt.festivalId
	const contentFest = content.indexOf('fest ') === 0
	const contentFestId = contentFest && parseInt(content.slice(5), 10)
	if(optFest) {
		if (optFest === contentFestId) return true
		return false
	} else {
		if(contentFestId) return false
	}
	return true
}


export default {
		discussionOf (id) {return this.list.filter(m => m.baseMessage === id)},
		aboutType (sType) {return this.list.filter(m => m.subjectType === sType)},
		ofType (mType) {return this.list.filter(m => m.messageType === mType)},
		byAuthor (author) {return this.list.filter(m => m.fromuser === author)},
		ofAndAbout (mType, sType) {return this.list.filter(m => m.messageType === mType && m.subjectType === sType)},
		ofAboutAndBy (mType, sType, author) {return this.list.filter(m => m.messageType === mType && m.subjectType === sType && m.fromuser === author)},
		aboutSets () {return this.list.filter(m => m.subjectType === 3)},
		gameTimeRatings () {return this.aboutSets().filter(m => m.messageType === 2)},
		setAverageRating (setId) {
			const gameTimeRatings = this.gameTimeRatings()
			const filtered = gameTimeRatings
				.filter(m => (m.subject === setId))
			const retVal = _.meanBy(filtered,
				m => parseInt(m.content, 10))
			//console.log('msg length: ' + this.list.length)
			//console.log('filtered length: ' + filtered.length)
			//console.log('setAverageRating: ' + retVal)
			//console.log('setId: ' + setId)
			//console.log('gameTimeRatings.length: ' + gameTimeRatings.length)
			return retVal ? retVal : 0
		},
		lastCheckin (userId) {return  this.list
			.filter(m => m.fromuser === userId && m.messageType === 3)
			.sort(timeStampSort)
			.reduce((pv, cv, i) => !i ? cv : pv, false)
		},
		recentCommentsAll () {return this.list
			.filter(m => m.messageType === 1)
		},
			//, viewer => '' + viewer + '.' + this.lastRemoteLoad + '.' + remoteData.MessagesMonitors.lastRemoteLoad),
		recentDiscussions (viewer) {return _.uniqBy(this.recentDiscussionAll(viewer)
			.map(message => message.baseMessage ? this.get(message.baseMessage) : message), 'id')},
		recentDiscussionEvent (viewer, event) {return this.recentDiscussionAll(viewer)
			.filter(this.eventConnectedFilter(event))},
		centerObjects () {
			const baseMessages = this.list
				.filter(m => !m.baseMessage)

			const discussionMessages = this.list
				.filter(m => m.baseMessage)

			//reduce the discussionMessages into an object organized by baseMessage
			const discussionByBase = discussionMessages.reduce((discussObj, message) => {
				const baseMessage = '' + message.baseMessage
				discussObj[baseMessage] = discussObj[baseMessage] ? discussObj[baseMessage] : []
				discussObj[baseMessage].push(message)
				return discussObj
			}, {})
			return discussionByBase
		},
		virginSubject (subjectObject) {return  !_.some(this.list,
			m => (m.subjectType === subjectObject.subjectType) && (m.subject === subjectObject.subject))
		},
		forArtist (artistId) {return this.list
			.filter(m => (m.subjectType === 2) && (m.subject === artistId))
		},
		forSet (setId) {return this.aboutSets()
			.filter(m => m.subject === setId)
		},
		forArtistReviewCard (artistId) {return  this.list
			.filter(m => (m.subjectType === 2) && (m.subject === artistId) && m.fromuser)
			.reduce((final, me) => {
				if(!final[me.fromuser]) final[me.fromuser] = []
				final[me.fromuser].push(me)
				final[me.fromuser] = final[me.fromuser]
					.sort((a, b) => {
						if(a.messageType - b.messageType) return a.messageType - b.messageType
						return timeStampSort(a, b)
					})
				return final
			}, {})
		},
		forced ({artistIds, festivalId}) {return  _.uniq(this.list
			.filter(m => m.fromuser ===  m.touser && m.subjectType === 2 && m.messageType === 4 && _.includes(artistIds, m.subject))
			.filter(m => researchApplicable(m.content, {festivalId: festivalId}))
			.map(m => m.subject))},
		skipped ({artistIds, festivalId}) {return  _.uniq(this.list
			.filter(m => m.fromuser ===  m.touser && m.subjectType === 2 && m.messageType === 5 && _.includes(artistIds, m.subject))
			.filter(m => researchApplicable(m.content, {festivalId: festivalId}))
			.map(m => m.subject))},
		saved ({artistIds, festivalId}) {return _.uniq(this.list
			.filter(m => m.fromuser ===  m.touser && m.subjectType === 2 && m.messageType === 6 && _.includes(artistIds, m.subject))
			.filter(m => researchApplicable(m.content, {festivalId: festivalId}))
			.map(m => m.subject))},
		hidden ({artistIds, festivalId}) {return _.uniq(this.list
			.filter(m => m.fromuser ===  m.touser && m.subjectType === 2 && m.messageType === 7 && _.includes(artistIds, m.subject))
			.filter(m => researchApplicable(m.content, {festivalId: festivalId}))
			.map(m => m.subject))},
		recentRatings ({artistIds, author}) {return _.uniq(this.list
			.filter(m => m.subjectType === 2 && m.messageType === 2 && m.fromuser === author && _.includes(artistIds, m.subject))
			.filter(m => moment(m.timestamp).add(1, 'y').isAfter())
			.map(m => m.subject))},
		recentReviews ({artistIds, author}) {return _.uniq(this.list
			.filter(m => m.subjectType === 2 && (m.messageType === 2 || m.messageType === 1) && m.fromuser === author && _.includes(artistIds, m.subject))
			.filter(m => moment(m.timestamp).add(1, 'y').isAfter())
			.map(m => m.subject))},
}