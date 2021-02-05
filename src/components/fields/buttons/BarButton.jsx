// src/components/fields/buttons/BarButton.jsx

import m from 'mithril'


const BarButton = vnode => { 
	return {
	  view: ({ attrs}) =>
	    <button 
	    	class="c44-fjcsa c44-h-10vh c44-w-10wh c44-ca c44-bca c44-dif c44-fdc c44-tac c44-faic" 
	    	onclick={attrs.itemClicked}
	    >
	    {
	    	//console.log('BarButton icon', attrs.icon.attrs.className)
	    }
	      {attrs.icon}
	      {attrs.name}
	    </button>
}}

export default BarButton