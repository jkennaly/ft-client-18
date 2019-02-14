// DiscussButton.jsx

import m from 'mithril'
// Services

import  ComposedNameField from '../../fields/ComposedNameField.jsx';
import  ReviewModal from '../../modals/ReviewModal.jsx';

const getSubject = attrs => {
	//console.log('DiscussButton subject ' + attrs.subject )
	return {
				sub: attrs.subject,
				type: attrs.subjectType ? attrs.subjectType : 10

	}
}

const DiscussButton = vnode => { 
	return {
	  view: ({ attrs }) =>
	    <div class="ft-fifty-button" onclick={e => {
	    	const sub = getSubject(attrs)
	    	attrs.discussSubject(sub, attrs.messageArray, attrs.rating)
	    	e.stopPropagation()
	    }} >
	      
	      <i class="fas fa-reply"/>
	    </div>
}};

export default DiscussButton;