// appendable.js

import m from 'mithril'
export default {
	append (data) { 
		const retVal = this.backfillList([data], true)
		//m.redraw()
		return retVal

	}  
}