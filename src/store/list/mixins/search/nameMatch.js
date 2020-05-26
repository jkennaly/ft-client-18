// nameMatch.js

import smartSearch from 'smart-search'

import _ from 'lodash'

export default {
	patternMatch (pattern, count = 5) { 
		return _.take(smartSearch(this.list,
			[pattern], {name: true}
			), count)
			.map(x => x.entry)
	}  
}