// ReviewButton.jsx

import m from 'mithril'
// Services

import  ComposedNameField from '../../fields/ComposedNameField.jsx';

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
	    <div class="c44-fifty-button" onclick={e => {
	    	const sub = getSubject(attrs)
	    	attrs.reviewSubject(sub)
	    	e.stopPropagation()
	    }} >
	      
	      <i class="fas fa-comment"/>
	      <i class="fas fa-star"/>
	    </div>
}};

export default ReviewButton;