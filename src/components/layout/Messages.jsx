// src/components/layout/Messages.jsx

import m from "mithril";
import _ from "lodash";

import MessageCategoryPane from "../../components/panes/MessageCategoryPane.jsx"
import DiscussionPane from "../../components/panes/DiscussionPane.jsx"
import {unread, flags, userRecent, remote} from '../../store/action/messageArrays'

import { remoteData } from "../../store/data"
import {subjectData} from '../../store/subjectData'
const messageArrays = {
	unread: unread,
	flags: flags,
	userRecent: userRecent
}
const baseFilter = (userId) => m => m.fromuser !== userId && ![RATING, CHECKIN].includes(m.messageType)

const Messages = {
	oninit: ({attrs}) => {
		if (attrs.titleSet) attrs.titleSet(`Message Center`)
		if(remote[m.route.param('filter')]) remote[m.route.param('filter')](attrs)
		},
	oncreate: ({dom}) => {
		const height = dom.clientHeight
		//console.log('Messages DOM', height)
		dom.querySelector('.c44-pane-single').style['height'] = `${height}px`
		dom.querySelector('.c44-pane-double').style['height'] = `${height}px`
	},
	view: ({attrs}) => 
		<div class="main-stage">
				<div class="c44-horizontal-fields">
					<div class="c44-pane-single">
						<MessageCategoryPane 
							userId={attrs.userId} 
							userRoles={attrs.userRoles} 
						/>
					</div>
					<div class="c44-pane-double">
						<DiscussionPane 
							userId={attrs.userId}
							userRoles={attrs.userRoles} 
							messageArrays={(messageArrays[m.route.param('filter')] ? messageArrays[m.route.param('filter')] : messageArrays.unread)(attrs.userId, attrs.userRoles)} 
							popModal={attrs.popModal} 
						/>
					</div>
				</div>

		</div>
	

};
export default Messages;
