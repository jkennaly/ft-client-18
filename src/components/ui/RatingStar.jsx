// RatingStar.jsx

const m = require("mithril");

const RatingStar = {
	view: ({ attrs }) =>
		<span class="ft-rating-star">

			{attrs.filled ? '\u2605' : '\u2606'}
		</span>
};

export default RatingStar;