// src/store/list/mixins/remote/nameSearch.js

import _ from "lodash"
import fetchT from "../../../../services/fetchT"

export default {
	remoteSearch(pattern) {
		return (
			fetchT(`/api/${this.fieldName}/search/${pattern}`)
				//.then(response => console.log('remoteSearch', pattern, response) || response)
				.then(response => response.json())
				.then(response =>
					_.isArray(response.data) ? response.data : response
				)
		)
	},
}
