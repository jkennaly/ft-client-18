// ReviewButton.jsx

import m from 'mithril'
import Icon from '../../fields/Icon.jsx'
// Services

import ComposedNameField from '../../fields/ComposedNameField.js';

const getSubject = attrs => {
	//console.log('ReviewButton subject ' + attrs.subject )
	return {
		subject: attrs.subject,
		subjectType: attrs.subjectType ? attrs.subjectType : 2
	}
}

const ReviewButton = vnode => {
	return {
		view: ({ attrs }) =>
			<div class="ft-fifty-button" onclick={e => {
				const sub = getSubject(attrs)
				attrs.reviewSubject(sub)
				e.stopPropagation()
			}} >

				<Icon name="bubble2" />
				<Icon name="star-full" />
			</div>
	}
};

export default ReviewButton;