// interactOptions.js

import _ from 'lodash'
import m from 'mithril'
import globals from '../../../../services/globals'

import archive from '../../../loading/archive'
import { loadModel } from '../../../loading/enlist'
import { subjectData } from '../../../subjectData'

const followItem = interactions => (so) => {
	return {
		name: `Follow ${subjectData.name(so)}`,
		icon: m('i', {
			class: "fas fa-user-plus",
			"data-fa-transform": "grow-15"
		}),
		itemClicked: e => interactions.setInteract(so, globals.FOLLOW),
		data: subjectData.get(so)
	}
}
const unfollowItem = interactions => (so) => {
	return {
		name: `Stop following ${subjectData.name(so)}`,
		icon: m('i', {
			class: "fas fa-user-minus",
			"data-fa-transform": "grow-15"
		}),
		itemClicked: e => interactions.clearInteract(so, globals.FOLLOW),
		data: subjectData.get(so)
	}
}
const blockItem = interactions => (so) => {
	return {
		name: `Block ${subjectData.name(so)}`,
		icon: m('i', {
			class: "fas fa-user-shield",
			"data-fa-transform": "grow-15"
		}),
		itemClicked: e => interactions.setInteract(so, globals.BLOCK),
		data: subjectData.get(so)
	}
}
const unblockItem = interactions => (so) => {
	return {
		name: `Stop blocking ${subjectData.name(so)}`,
		icon: m('i', {
			class: "fas fa-user-circle",
			"data-fa-transform": "grow-15"
		}),
		itemClicked: e => interactions.clearInteract(so, globals.BLOCK),
		data: subjectData.get(so)
	}
}
export default (interactions) => {
	return {
		interactOptions(id) {
			const so = { subjectType: this.subjectType, subject: id }
			const currentInteractions = interactions.getFiltered(so)
			const currentlyFollowing = currentInteractions.some(i => i.type === globals.FOLLOW)
			const currentlyBlocking = currentInteractions.some(i => i.type === globals.BLOCK)

			//available options
			//view profile
			//send a message

			//follow
			//unfollow
			const follow = currentlyFollowing ? unfollowItem(interactions) : followItem(interactions)
			//block
			//unblock
			const block = currentlyBlocking ? unblockItem(interactions) : blockItem(interactions)
			return [follow(so), block(so)]
		}
	}
}