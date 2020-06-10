// src/components/layout/Messages.jsx

import m from "mithril";
import _ from "lodash";

import MessageCategoryPane from "../../components/panes/MessageCategoryPane.jsx"
import DiscussionPane from "../../components/panes/DiscussionPane.jsx"
import {unread, flags, userRecent, remote, related} from '../../store/action/messageArrays'

import { remoteData } from "../../store/data"
import { subjectData } from '../../store/subjectData'
const messageArrays = {
	unread: unread,
	flags: flags,
	userRecent: userRecent,
	related: related
}
const baseFilter = (userId) => m => m.fromuser !== userId && ![RATING, CHECKIN].includes(m.messageType)

const Messages = {
	oninit: ({attrs}) => {
		//console.log('Messages filter', attrs.filter)
		if (attrs.titleSet) attrs.titleSet(`Message Center`)
		if(remote[attrs.filter]) return remote[attrs.filter](attrs)
		},
	oncreate: ({dom}) => {
		const height = dom.clientHeight
		dom.querySelector('.ft-pane-single').style['height'] = `${height}px`
		dom.querySelector('.ft-pane-double').style['height'] = `${height}px`
	},
	view: ({attrs}) => 
		<div class="main-stage">
			<div class="ft-horizontal-fields">
				<div class="ft-pane-single">
					<MessageCategoryPane 
						userId={attrs.userId} 
						userRoles={attrs.userRoles} 
					/>
				</div>
				<div class="ft-pane-double">
				{
					//console.log('Messages attrs', attrs)
				}
					<DiscussionPane 
						userId={attrs.userId}
						userRoles={attrs.userRoles} 
						messageArrays={(messageArrays[attrs.filter] ? messageArrays[attrs.filter] : messageArrays.unread)(attrs.userId, attrs.userRoles, attrs.messageId)} 
						popModal={attrs.popModal} 
					/>
				</div>
			</div>
		</div>
	

};
export default Messages;
