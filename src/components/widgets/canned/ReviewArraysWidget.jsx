// src/components/widgets/canned/ReviewArraysWidget.jsx

import m from 'mithril'

import FixedCardWidget from '../FixedCard.jsx';



const ReviewArraysWidget = {
		view: (vnode) => <FixedCardWidget 
				header={vnode.attrs.header} 
			>
				{
					vnode.children
				}
			</FixedCardWidget>	
};

export default ReviewArraysWidget;