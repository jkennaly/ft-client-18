// src/components/ui/BannerButton.jsx

import m from "mithril"

const BannerButton = {
	view: ({ attrs }) => (
		<div
			class={"ft-nav-button" + (attrs.classes ? " " + attrs.classes : "")}
			onclick={attrs.clickFunction}
		>
			{attrs.icon}
		</div>
	),
}

export default BannerButton
