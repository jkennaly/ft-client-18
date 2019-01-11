// ListenButton.jsx

import m from 'mithril'
// Services
import Auth from '../../../services/auth.js';
const auth = new Auth();

import {subjectData} from '../../../store/data.js'

const getSubject = attrs => {
	console.log('ListenButton subject ' + attrs.subject )
	return {
				sub: attrs.subject,
				type: attrs.subjectType ? attrs.subjectType : 2

	}
}

const ListenButton = vnode => { 
	var userId = 0
	return {
		oninit: () => {
			auth.getFtUserId()
				.then(id => userId = id)
				.then(() => {})
				.then(m.redraw)
				.catch(err => m.route.set('/auth'))
		},
		//onupdate: () => console.log('ListenButton Update'),
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