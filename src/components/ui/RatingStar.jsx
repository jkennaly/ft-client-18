// src/components/ui/RatingStar.jsx

import m from 'mithril'

const RatingStar = {
	view: ({ attrs }) =>
		<span class={`ft-rating-star ${attrs.action ? 'c44-cp' : ''}`} onclick={attrs.action ? attrs.action : () => 0}>

			{attrs.filled ? '\u2605' : '\u2606'}
		</span>
};

export default RatingStar;