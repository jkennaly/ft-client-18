// ListenButton.jsx

import m from 'mithril'
// Services

import {subjectData} from '../../../store/subjectData.js'
import Icon from '../../fields/Icon.jsx'

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
	    	window.open('https://open.spotify.com/search/' + name)
	    	e.stopPropagation()
	    }} >
	      
	      <Icon name="spotify"/>
	    </div>
}};

export default ListenButton;