// MessageCategoryPane.jsx



import m from 'mithril'
import _ from 'lodash'


import CenterMenuCard from '../cards/CenterMenuCard.jsx';
import WidgetContainer from '../layout/WidgetContainer.jsx';

import {subjectData} from '../../store/data';



const MessageCategoryPane = vnode => {			
					
	return {
		view: ({attrs}) => <WidgetContainer>
				<CenterMenuCard fieldValue="recent" />
		</WidgetContainer>
}};

export default MessageCategoryPane;
