// src/components/fields/buttons/QuarterButton.jsx

import m from 'mithril'


const QuarterButton = vnode => { 
	return {
	  view: ({ attrs, children }) =>
	    <div class="ft-quarter-button" onclick={attrs.clickFunction} >
	      {children}
	    </div>
}}

export default QuarterButton