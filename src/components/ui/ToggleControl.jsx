// ToggleControl.jsx

import m from 'mithril'
import _ from 'lodash'



const ToggleControl = vnode => {
	return {
		view: ({ attrs }) => <ul class="ft-toggle-control">
  <li class="ft-toggle-list-item">
    <div>{attrs.offLabel}</div>
    <input 
    	class="ft-toggle ft-toggle-light" 
    	id={`${attrs.offLabel}-${attrs.onLabel}`} 
    	type="checkbox"
    	onclick={e => {
    		e.stopPropagation()
            if(!attrs.permission) return
    		attrs.setter(attrs.getter() ? 0 : 1)
    	}}
        checked={attrs.getter()}
    />
    <label class="ft-toggle-btn" for={`${attrs.offLabel}-${attrs.onLabel}`}></label>
    <div>{attrs.onLabel}</div>
  </li>
  </ul>
	};

}

export default ToggleControl;