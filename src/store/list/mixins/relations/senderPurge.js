// src/store/list/mixins/relations/senderPurge.js

import _ from "lodash"

export default {
	senderPurge(senderId) {
		this.list = this.list.filter(m => m.fromuser !== senderId)
	}
}
