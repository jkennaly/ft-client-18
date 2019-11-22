// DiscussionWidget.jsx

//given a list of bands to research, this widget 
//filters out unneded ones, sorts the rest and displays artist cards



import m from 'mithril'
import _ from 'lodash'

// Services
import {buildTree, mapActivities, baseMessage} from '../../../services/messageArrayFunctions.js';
import Auth from '../../../services/auth.js';
const auth = new Auth();

import SubjectReviewCard from '../../../components/cards/SubjectReviewCard.jsx';
import {subjectCard} from '../../../components/cards/subjectCard.js';
import ActivityCard from '../../../components/cards/ActivityCard.jsx';
import LargeCardWidget from '../LargeCardWidget.jsx';
import  DiscussModal from '../../modals/DiscussModal.jsx';
import {remoteData} from '../../../store/data';
import {subjectData} from '../../../store/subjectData'



const DiscussionWidget = vnode => {
	var userId = 0
	const routeId = parseInt(m.route.param("id"), 10)
	var reviewing = false
	var discussing = false
	var subjectObject = {}
	var removed = []
	let messageArray = []
	let pattern;
	const patternChange = e => {
		pattern = e.target.value
		//console.log('ArtistSearchWidget pattern ' + pattern)
	}   
	const loadSubjectObject = s => subjectObject = _.clone(s)
	const loadMessageArray = me => messageArray = _.clone(me)
	const startDiscussing = () => discussing = true
					
					
	return {
		oninit: ({attrs}) => {
			userId = auth.userId()
			//request an update to this discussion
			const discussionBase = baseMessage(attrs.messageArray).id
			remoteData.Messages.acquireListUpdate('filter[where][baseMessage]=' + discussionBase)
 		},
		view: ({attrs}) => <LargeCardWidget 
				header="Discuss"
				headerCard = {attrs.headerCard && attrs.messageArray.length ? 
					subjectCard(attrs.messageArray[0]) : 
				''}
			>
			{!attrs.supressModal && messageArray.length ? <DiscussModal
				display={discussing} 
				hide={sub => {discussing = false;}}
				subject={subjectObject}
				messageArray={messageArray}
				reviewer={messageArray[0].fromuser}
				user={userId}
			/> : ''}
			{
				//first card is subjectMessage SubjectReviewCard
				<SubjectReviewCard 
					messageArray={attrs.messageArray} 
					reviewer={attrs.messageArray[0].fromuser}
					overlay={'discuss'}
					discussSubject={attrs.discussSubject}
					userId={userId}
				/>
			}
			{

					mapActivities(attrs.discussSubject, remoteData.Messages, ActivityCard)(
					buildTree(attrs.messageArray, remoteData.Messages.discussionOf(baseMessage(attrs.messageArray).id))
					)
				//map the tree to activity cards with left-spacers (1 space for each depth of tree)

			}
			</LargeCardWidget>	
}};

export default DiscussionWidget;