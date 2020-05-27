// FiftyButton.jsx

import m from 'mithril'


const FiftyButton = vnode => { 
	return {
	  view: ({ attrs, children }) =>
	    <div class="ft-fifty-button" onclick={attrs.clickFunction} >
	      {children}
	    </div>
}}

export default FiftyButton