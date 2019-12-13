// src/components/widgets/canned/DiscussionWidget.jsx

//given a list of bands to research, this widget 
//filters out unneded ones, sorts the rest and displays artist cards



import m from 'mithril'
import _ from 'lodash'

// Services
import {buildTree, mapActivities, baseMessage} from '../../../services/messageArrayFunctions.js';


import SubjectReviewCard from '../../../components/cards/SubjectReviewCard.jsx';
import {subjectCard} from '../../../components/cards/subjectCard.js';
import ActivityCard from '../../../components/cards/ActivityCard.jsx';
import LargeCardWidget from '../LargeCardWidget.jsx';
import  DiscussModal from '../../modals/DiscussModal.jsx';
import {remoteData} from '../../../store/data';
import {subjectData} from '../../../store/subjectData'

const flagAttrs = attrs => {
	if(!attrs.messageArray.some(f => f.flagType)) return {}
	const flag = attrs.messageArray.find(f => f.flagType)
	return		{
						flag: flag, 
						asAdmin: attrs.userRoles.includes('admin'),
						discussFlag: attrs.discussSubject,
						popModal: attrs.popModal,
						asUser: _.get(flag, 'fromuser', -1) === attrs.userId
					}}

const DiscussionWidget = {
		oninit: ({attrs}) => {
			//console.log('DiscussionWidget init')
			//request an update to this discussion
			const discussionBase = baseMessage(attrs.messageArray)
			return Promise.all([
				attrs.messageArray.map(subjectData.getLocalPromise),
				discussionBase && discussionBase.messageType ? remoteData.Messages.acquireListSupplement(`filter=${JSON.stringify({where: {baseMessage: discussionBase.id}})}`) : [] 			])
		},
		view: ({attrs}) => <LargeCardWidget 
				header="Discuss"
				headerCard = {attrs.headerCard && attrs.messageArray.length && (attrs.messageArray.some(m => m.messageType && m.subjectType !== MESSAGE) || attrs.messageArray.some(m => m.flagType)) ? 
					subjectCard(
						attrs.messageArray.find(m => m.flagType || m.subjectType !== MESSAGE), 
						//console.log('DiscussionWidget flagAttrs(attrs)', flagAttrs(attrs), attrs.messageArray) || 
						flagAttrs(attrs)) : 
				''}
				closeClick={attrs.userId && attrs.headerCard && !attrs.messageArray.some(f => f.flagType) ? e => {
					e.stopPropagation()
					attrs.messageArray
						.filter(m => m.fromuser !== attrs.userId && remoteData.MessagesMonitors.unread(m.id))
						.forEach(m => remoteData.MessagesMonitors.markRead(m.id))
					m.redraw()
				} : undefined}
			>
			{
				//first card is subjectMessage SubjectReviewCard
				!attrs.messageArray.some(m => m.flagType) ? <SubjectReviewCard 
					messageArray={attrs.messageArray} 
					reviewer={_.get(attrs.messageArray.find(m => !m.baseMessage), 'fromuser')}
					overlay={'discuss'}
					discussSubject={attrs.discussSubject}
					userId={attrs.userId}
				/> : ''
			}
			{
				//first card is flag
				attrs.messageArray.some(f => f.flagType) ? 
				subjectCard(
					{subjectType: FLAG, subject: attrs.messageArray.find(f => f.flagType).id}, 
					flagAttrs(attrs)
				) : ''
			}
			{
				//console.log('DiscussionWidget messageArray', attrs.messageArray)
		}
			{
				mapActivities(
					attrs.discussSubject, 
					remoteData.Messages, 
					ActivityCard, 
					attrs.userId
				)(
					attrs.messageArray.some(m => m.messageType) ? 
					buildTree(
						attrs.messageArray.filter(m => m.messageType), 
						attrs.messageArray.some(f => f.flagType) ? 
							attrs.messageArray.filter(m => m.messageType) : 
							remoteData.Messages.getFiltered(
								m => m.subjectType === MESSAGE && attrs.messageArray.map(me => me.id).includes(m.baseMessage)
							)
					) : {}
				)
				//map the tree to activity cards with left-spacers (1 space for each depth of tree)

			}
			</LargeCardWidget>	
}

export default DiscussionWidget