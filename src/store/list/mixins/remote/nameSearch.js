// src/store/list/mixins/remote/nameSearch.js

import _ from "lodash"
import fetchT from "../../../../services/fetchT"
const apiUrl = API_URL || 'https://api.festigram.app'

export default {
	remoteSearch(pattern) {
		return (
			fetchT(`${apiUrl}/api/${this.fieldName}/search/${pattern}`)
				//.then(response => console.log('remoteSearch', pattern, response) || response)
				.then(response => response && response.json())
				.then(response =>
					response && _.isArray(response.data) ? response.data : response
				)
		)
	},
}
