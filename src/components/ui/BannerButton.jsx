// src/components/ui/BannerButton.jsx

import m from 'mithril'

const BannerButton = {
	view: ({ attrs }) =>
		<div class="c44-nav-button" onclick={attrs.clickFunction}>
			{attrs.icon}
		</div>
};

export default BannerButton;