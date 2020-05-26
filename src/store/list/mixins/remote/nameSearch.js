// src/store/list/mixins/remote/nameSearch.js

import _ from 'lodash'

export default {
	remoteSearch (pattern) { 
		return fetch(`/api/Artists/search/${pattern}`)
			.then(response => response.json())
			.then(response => _.isArray(response.data) ? response.data : response)

	}  
}