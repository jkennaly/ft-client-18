// nameMatch.js

import smartSearch from 'smart-search'


export default {
	patternMatch (pattern, count = 5) { 
		return _.take(smartSearch(this.list,
			[pattern], {name: true}
			), count)
			.map(x => x.entry)
	}  
}