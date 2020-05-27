// MessageCategoryPane.jsx



import m from 'mithril'
import _ from 'lodash'


import CenterMenuCard from '../cards/CenterMenuCard.jsx';
import WidgetContainer from '../layout/WidgetContainer.jsx';

import {remoteData} from '../../store/data';
import {subjectData} from '../../store/subjectData';



const MessageCategoryPane = {
	
		view: ({attrs}) => <div class="ft-vertical-fields">
				<CenterMenuCard fieldValue="unread" action={e => m.route.set(`/messages/unread`)} />
				<CenterMenuCard fieldValue="my recent messages" action={e => m.route.set(`/messages/userRecent`)} />
				<CenterMenuCard fieldValue="flags" action={e => m.route.set(`/messages/flags`)} />
		</div>
}

export default MessageCategoryPane;
