// ListenButton.jsx

import m from 'mithril'
// Services

import {subjectData} from '../../../store/data.js'

const getSubject = attrs => {
	console.log('ListenButton subject ' + attrs.subject )
	return {
				sub: attrs.subject,
				type: attrs.subjectType ? attrs.subjectType : 2

	}
}

const ListenButton = vnode => { 
	return {
	  view: ({ attrs }) =>
	    <div class="ft-fifty-button" onclick={e => {
	    	const name = subjectData.name(attrs.subject, attrs.subjectType)
	    	window.open('https://open.spotify.com/search/results/' + name)
	    	e.stopPropagation()
	    }} >
	      
	      <i class="fas fa-headphones"/>
	    </div>
}};

export default ListenButton;