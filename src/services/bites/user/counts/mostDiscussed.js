// services/bites/counts/mostDiscussed.js

//get the subjectCard for the three subjects the user has discussed most


import m from 'mithril'
import _ from 'lodash'
import {subjectCard} from '../../../../components/cards/subjectCard'

const biteCache = {}
const biteTimes = {}

//get all user discussion
//count the discussion comments for the subject of each base message
//take the three most discussed subjects


const discussedSubjects = (discusserId, messages) => messages
	.lbfilter({
		where: { and: [
			{fromuser: discusserId},
			{messageType: DISCUSSION}
		]},
		fields: {baseMessage: true, id:true},
		order: 'id DESC',
		limit: '500'
	})
	.then(discussionBaseRaw => discussionBaseRaw.map(x => x.baseMessage))
	.then(allDiscussBaseIds => Promise.all([allDiscussBaseIds, (messages
		.lbfilter({
			where: { and: [
			{id: {inq: _.uniq(allDiscussBaseIds)}},
			{subjectType: {nin: [FLAG, USER, MESSAGE]}}
		]},
		fields: {subject: true, subjectType: true, id:true}
		}))]

	))
	.then(([allDiscussBaseIds, discussSubjectsRaw]) => [allDiscussBaseIds, discussSubjectsRaw.reduce((idMap, x) => {
		idMap[x.id] = `[${x.subjectType}][${x.subject}]`
		return idMap
	}, {})])
	.then(([allDiscussBaseIds, discussSubjectKeys]) => [
		allDiscussBaseIds, 
		allDiscussBaseIds.reduce((total, baseId) => {
			const key = discussSubjectKeys[baseId]
			total[key] = 1 + (total[key] ? total[key] : 0)
			return total
		}, {})
	])
	.then(([allDiscussBaseIds, discussSubjectCounts]) => [allDiscussBaseIds, _.toPairs(discussSubjectCounts)])
	//.then(([allDiscussBaseIds, discussSubjectCounts]) => [allDiscussBaseIds, discussSubjectCounts])
	.then(([allDiscussBaseIds, discussSubjectCountsUnsorted]) => [allDiscussBaseIds, discussSubjectCountsUnsorted.filter(x => x[0] && x[0] !== 'undefined' && x[1]).sort((a, b) => b[1] - a[1])])
	//.then(x => console.log(`[allDiscussBaseIds, discussSubjectCountsSorted]`, x) || x)
	.then(([allDiscussBaseIds, discussSubjectCountsSorted]) => _.take(discussSubjectCountsSorted, 3)
			.map(dsc => Array.from(dsc[0].matchAll(/\[([0-9]{1,})\]/g)))
			//.filter(x => console.log('discussionCounts', x) || true)
			.map(x => [parseInt(x[0][1], 10), parseInt(x[1][1], 10)])
			.map(([subjectType, subject]) => {return {subjectType: subjectType, subject: subject}})
	)
	.then(fav => {
		_.set(biteTimes, `users.discussedSubjects[${discusserId}]`, Date.now())
		_.set(biteCache, `users.discussedSubjects[${discusserId}]`, fav)
		return fav
	})
const cachedBite = (discusserId, messages) => {
	const cacheTime = _.get(biteTimes, `users.discussedSubjects[${discusserId}]`, 0)
	const cacheOk = cacheTime + 60000 > Date.now()
	if (!cacheOk) discussedSubjects(discusserId, messages)
		.catch(console.log)
	return _.get(biteCache, `users.discussedSubjects[${discusserId}]`, [])
}
export default  (discusserId, messages) => {
	const value = cachedBite(discusserId, messages)
		//.filter(x => console.log('discussedSubjects cachedBite', x) || true)
		.map(baseValue => subjectCard(baseValue, {
			userId: discusserId,
			uiClass:''
		}))
		/*
		.map(baseValue => baseValue ? subjectCard({subject: baseValue.id, subjectType: ARTIST}, {
		userId: discusserId,
		uiClass:''

	}) : '')
	*/
	//console.log('recentFavoriteBite', baseValue)

	const title = 'Most Discussed'
	return {
		value: value,
		title: title,
		public: true,
		name: title
	}
}