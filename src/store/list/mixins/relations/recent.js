// src/store/list/mixins/relations/recent.js

import _ from 'lodash'


export default (messages) => { return {
	recent (count) { 
		return messages
			.lbfilter({fields:{fromuser: true, id: true}, "limit":500, "order":"id DESC"})
			.then(ms => _.take(_.uniqBy(ms, 'fromuser'), count ? count : 10).map(ms => ms.fromuser))
	} 
}}