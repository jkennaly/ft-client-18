// src/store/list/mixins/relations/messageSenders.js

import _ from 'lodash'

const alreadyChecked = []


export default (users) => { return {
	messageSenders () {
		//console.log('messageSenders')
		const senders = _.uniq(this.list.map(x => x.fromuser))
		const haveSenders = users.list.map(x => x.id)
		const needSenders = _.difference(senders, haveSenders)
		const uncheckedSenders = _.difference(needSenders, alreadyChecked)
		alreadyChecked.push(...uncheckedSenders)
		return users.getManyPromise(uncheckedSenders)
	} 
}}