// src/components/ui/ToggleControl.jsx

import m from 'mithril'
import _ from 'lodash'



const ToggleControl = vnode => {
	return {
		view: ({ attrs }) => <ul class="c44-toggle-control">
  <li class="c44-toggle-list-item">
    <div>{attrs.offLabel}</div>
    <input 
    	class="c44-toggle c44-toggle-light" 
    	id={`${attrs.offLabel}-${attrs.onLabel}`} 
    	type="checkbox"
    	onclick={e => {
    		e.stopPropagation()
            if(!attrs.permission) return attrs.unauth ? attrs.unauth(m.route.get()) : undefined
    		attrs.setter(attrs.getter() ? 0 : 1)
    	}}
        checked={attrs.getter()}
    />
    <label class="c44-toggle-btn" for={`${attrs.offLabel}-${attrs.onLabel}`}></label>
    <div>{attrs.onLabel}</div>
  </li>
  </ul>
	};

}

export default ToggleControl;