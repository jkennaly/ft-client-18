// src/components/ui/InteractionBar.jsx

import m from "mithril"
import BarButton from "../fields/buttons/BarButton.jsx"
import { remoteData } from "../../store/data"

const { Users: users, Interactions: interactions } = remoteData

//a follow/unfollow button
//a block/unblock button

const InteractionBar = {
	view: ({ attrs, children }) => (
		<div class="c44-df c44-fjcsa">
			{!interactions.lastRemoteLoad
				? []
				: users.interactOptions(attrs.targetId).map(opt => m(BarButton, opt))}
		</div>
	)
}

export default InteractionBar
