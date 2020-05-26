// src/components/ui/RatingStar.jsx

import m from 'mithril'

const RatingStar = {
	view: ({ attrs }) =>
		<span class="c44-rating-star" onclick={attrs.action ? attrs.action : () => 0}>

			{attrs.filled ? '\u2605' : '\u2606'}
		</span>
};

export default RatingStar;