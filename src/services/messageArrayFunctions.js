// messageArrayFunctions.js
import m from 'mithril'
import _ from 'lodash'
import globals from "./globals"

const displayRating = me => {

	const rm = me.filter(m => m.messageType === 2)
	const r = rm.length ? rm[0] : 0
	return r
}

export const baseMessage = me => me.find(m => m.subjectType !== globals.MESSAGE)
const getReplies = (m, messageArray) => messageArray
	.filter(possibleReply => possibleReply.subject === m.id)

//an array of messages that are not replied to
const getUnreplied = messageArray => messageArray
	.filter((m, i, arr) => !_.some(arr, el => el.subject === m.id))

//an array of messages that the replyArray is replying to
const getRepliedTo = (replyArray, replyToArrayPossible) => replyToArrayPossible
	.filter((m, i, arr) => _.some(replyArray, reply => reply.subject === m.id))


const getEnds = assocObject => _.keys(assocObject).map(k => {
	if (assocObject[k].id) return [assocObject[k].id]
	return getEnds(assocObject[k])

})
	//flatten the array one level
	.reduce((prev, cur) => prev.concat(cur), [])

const replaceEnd = (newEnd, assocObject, replaceKey) => {
	const keys = _.keys(assocObject)
	//if our target key is at this level of assocObject
	if (keys.indexOf(replaceKey) > -1) {
		assocObject[replaceKey] = newEnd
		return assocObject
	}
	//const check for additional depth
	const deeperKeys = keys.filter(k => !assocObject[k].id)
	const replacedAssocObject = deeperKeys.reduce((assObject, key) => {
		assObject[key] = replaceEnd(newEnd, assObject[key], replaceKey)
		return assObject
	}, assocObject)
	//console.log('messageArrayFunctions replaceEnd')
	//console.log(replaceKey)
	//console.log(keys)
	//console.log(deeperKeys)
	//console.log(assocObject)
	//console.log(replacedAssocObject)

	return replacedAssocObject

}

//an array of objects for each message in the replyToArray
const makeReplyAssocObjects = (replyArray, assocObject) => {
	if (!replyArray.length) return assocObject
	//find repliable ids in the assocObject
	const repliableIds = getEnds(assocObject)
	//get the items in the replyArray that are replying to repliableIds
	const attachableReplies = replyArray
		.filter(m => repliableIds.indexOf(m.subject) > -1)
	//console.log('messageArrayFunctions makeReplyAssocObjects2a')
	//console.log(repliableIds)
	//console.log(attachableReplies)

	//if there are no attachable replies, process is complete
	if (!attachableReplies.length) return assocObject

	//convert attachble replies to assoc Objects
	const assocEnds = attachableReplies
		.map(function (m) {
			const assoc = {}
			assoc['' + m.id] = m
			//console.log('messageArrayFunctions assocEnds')
			//console.log(assoc)
			return assoc
		})
	//console.log('messageArrayFunctions makeReplyAssocObjects2a')
	//console.log(_.keys(assocEnds[0]))

	const idsWithReplies = _.uniq(attachableReplies
		.map(m => m.subject))

	const replyAssocObjects = idsWithReplies
		.map(function (id) {
			const baseObject = assocEnds
				.filter(endAssoc => endAssoc[_.keys(endAssoc)[0]].subject === id)
				.reduce(function (assoc, endAssoc) {
					const replyId = endAssoc[_.keys(endAssoc)[0]].subject
					//console.log('messageArrayFunctions makeReplyAssocObjects2b')
					//console.log(replyId)
					//console.log(assoc)
					if (!assoc[replyId]) {
						assoc[replyId] = endAssoc
					} else {
						_.assign(assoc[replyId], endAssoc)
					}
					//console.log(assoc)
					return assoc
				}, {})
			return baseObject
		})

	const replacedAssocObject = replyAssocObjects
		.reduce((finalAssocObject, replyAssocObject) => {
			const replyKey = _.keys(replyAssocObject)[0]
			//console.log('messageArrayFunctions makeReplyAssocObjects2 reduce')
			//console.log(replyKey)
			const replacedObject = replaceEnd(replyAssocObject[replyKey], finalAssocObject, replyKey)
			return replacedObject
		}, assocObject)

	const remainingReplies = replyArray
		.filter(m => repliableIds.indexOf(m.subject) < 0)

	//console.log('messageArrayFunctions makeReplyAssocObjects2b')




	//console.log('messageArrayFunctions makeReplyAssocObjects2')
	//console.log(repliableIds)
	//console.log(_.keys(assocEnds[0]))
	//console.log(attachableReplies)
	//console.log(assocEnds)
	//console.log(idsWithReplies)
	//console.log(replyAssocObjects)
	//console.log(replacedAssocObject)
	//console.log(remainingReplies)

	return makeReplyAssocObjects(remainingReplies, replacedAssocObject)
}


export const buildTree = (me, discussion) => {
	//console.log('messageArrayFunctions buildTree me discussion', me, discussion)
	const base = baseMessage(me)
	if (!base) return {}

	//arrange discussionMessages into a tree object
	const unreplied = getUnreplied(discussion)
	const replied = getRepliedTo(unreplied, discussion)
		.concat(unreplied.length ? [base] : [])
	const startObject = base.subjectType !== globals.FLAG ? { [`${base.id}`]: base } : (
		me.filter(m => m.subjectType === globals.FLAG).reduce((so, m) => _.set(so, `${m.id}`, m), {})
	)
	const assocObject = makeReplyAssocObjects(discussion, startObject)
	//const assocObject = discussion.reduce((pv, cv))
	//console.log('messageArrayFunctions buildTree', base, discussion, unreplied, replied, assocObject)

	//first level: the baseMessage
	return assocObject

}

export const mapActivities = (loadSubjectObject, messages, ActivityCard, userId) => function recurse(obj, spacers = 1, divs = [], id = 0) {
	let updatedDivs = divs
	let updatesSpacers = spacers
	const message = messages.get(id)
	//console.log('messageArrayFunctions mapActivities', obj, spacers, message)
	//object end: the current object is a message
	if (obj.fromuser && obj.subjectType === globals.MESSAGE) {
		//console.log('messageArrayFunctions mapActivities prep end div')
		let spacerArr = []
		for (var i = 1; i <= spacers; i++) {
			spacerArr.push(m('.spacer'))
		}
		const newDiv = m(".ft-horizontal-fields",
			spacerArr,
			m(ActivityCard, {
				messageArray: [obj],
				discusser: obj.fromuser,
				overlay: 'discuss',
				discussSubject: loadSubjectObject,
				userId: userId
			})
		)
		//console.log('messageArrayFunctions mapActivities push end div')
		updatedDivs = divs.concat([newDiv])
		updatesSpacers++
	}
	//not object end: increase spacer count, and mapActivities for all values
	//the baseMessage is handled separately, so include only replies
	else if (message && [globals.MESSAGE, globals.FLAG].includes(message.subjectType)) {
		//console.log('messageArrayFunctions mapActivities prep mid div')
		let spacerArr = []
		for (var i = 1; i <= spacers; i++) {
			spacerArr.push(m('.spacer'))
		}
		//console.log('messageArrayFunctions mapActivities mid div')
		//console.log(id)
		//console.log(id + 123456)
		//console.log(message)
		const newDiv = m(".ft-horizontal-fields",
			spacerArr,
			m(ActivityCard, {
				messageArray: [message],
				discusser: message.fromuser,
				overlay: 'discuss',
				discussSubject: loadSubjectObject,
				userId: userId
			}

			)
		)
		//console.log('messageArrayFunctions mapActivities push mid div')
		//only messages that are replies are shown this way
		updatedDivs = divs.concat([newDiv])
		updatesSpacers++
	}

	const objKeys = _.keys(obj).map(k => parseInt(k, 10))

	//console.log('messageArrayFunctions mapActivities')
	//if(!obj.fromuser) console.log(objKeys)
	//	else console.log(obj)
	//console.log(updatedDivs)

	//console.log(spacers)
	if (!objKeys.length || obj.fromuser) return updatedDivs
	return objKeys.map(k => recurse(obj[k], updatesSpacers, updatedDivs, k))

}