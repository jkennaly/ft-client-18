// src/componenets/fields/IconText.jsx

import m from 'mithril'

const IconText = {
	view: ({ attrs }) =>
		<span class="ft-icon-span" >
			{m.trust(`<svg class="ft-icon icon icon-${attrs.name} ${attrs.classes ? attrs.classes : ''}"><use xlink:href="img/symbol-defs.svg#icon-${attrs.name}"></use></svg>`)}
		</span>
}

export default IconText