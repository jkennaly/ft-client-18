// src/store/list/mixins/remote/updateInstance.js

import _ from "lodash"

import provide from "../../../loading/provide"

export default {
	updateInstance(data, id) {
		const end = `/api/${this.fieldName}/${id}`
		const currentEl = this.get(id)
		let newEl = _.assign({}, currentEl, data)
		//delete newEl.timestamp
		newEl.timestamp = new Date()
		//console.log('updateInstance ' + this.fieldName, data, id, currentEl, newEl)
		//console.log(data)
		return provide(newEl, this.fieldName, "", end, "PATCH").then(responseEl =>
			this.backfillList([responseEl], true)
		)
	}
}
