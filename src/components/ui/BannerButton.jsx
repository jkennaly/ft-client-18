

// BannerButton.jsx

const m = require("mithril");

const BannerButton = {
	view: ({ attrs }) =>
		<div class="banner-button">
			{attrs.icon}
		</div>
};

export default BannerButton;