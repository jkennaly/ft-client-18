// ToggleControl.jsx

import m from 'mithril'
import _ from 'lodash'



const ToggleControl = vnode => {
	return {
		view: ({ attrs }) => <ul class="ft-toggle-control">
  <li class="ft-toggle-list-item">
    <span>{attrs.offLabel}</span>
    <input 
    	class="ft-toggle ft-toggle-light" 
    	id="cb1" 
    	type="checkbox"
    	onclick={e => {
    		e.stopPropagation()
    		attrs.setter(attrs.getter() ? 0 : 1)
    	}}
        checked={attrs.getter()}
    />
    <label class="ft-toggle-btn" for="cb1"></label>
    <span>{attrs.onLabel}</span>
  </li>
			{/*
				//determine toggle state (getter)
				//display current state description and button text
				//on button press, flip state (setter)


    	

			*/}
			
  </ul>
	};

}

export default ToggleControl;