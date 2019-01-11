// ReviewButton.jsx

import m from 'mithril'
// Services
import Auth from '../../../services/auth.js';
const auth = new Auth();

import  ComposedNameField from '../../fields/ComposedNameField.jsx';
import  ReviewModal from '../../modals/ReviewModal.jsx';

const getSubject = attrs => {
	console.log('ReviewButton subject ' + attrs.subject )
	return {
				sub: attrs.subject,
				type: attrs.subjectType ? attrs.subjectType : 2

	}
}

const ReviewButton = vnode => { 
	var userId = 0
	return {
		oninit: () => {
			auth.getFtUserId()
				.then(id => userId = id)
				.then(() => {})
				.then(m.redraw)
				.catch(err => m.route.set('/auth'))
		},
		//onupdate: () => console.log('ReviewButton Update'),
	  view: ({ attrs }) =>
	    <div class="ft-fifty-button" onclick={e => {
	    	const sub = getSubject(attrs)
	    	attrs.reviewSubject(sub)
	    	e.stopPropagation()
	    }} >
	      
	      <i class="fas fa-comment"/>
	      <i class="fas fa-star"/>
	    </div>
}};

export default ReviewButton;