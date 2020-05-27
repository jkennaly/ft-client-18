// DiscussButton.jsx

import m from 'mithril'
// Services

import  ComposedNameField from '../../fields/ComposedNameField.jsx';
import  ReviewModal from '../../modals/ReviewModal.jsx';

const getSubject = attrs => {
	//console.log('DiscussButton subject ' + attrs.subject )
	return {
				subject: attrs.subject,
				subjectType: attrs.subjectType ? attrs.subjectType : 10

	}
}

const DiscussButton = vnode => { 
	return {
	  view: ({ attrs }) =>
	    <div class="ft-fifty-button" onclick={e => {
	    	const so = getSubject(attrs)
	    	attrs.discussSubject(so, attrs.messageArray)
	    	e.stopPropagation()
	    }} >
	      
	      <i class="fas fa-reply"/>
	    </div>
}};

export default DiscussButton;