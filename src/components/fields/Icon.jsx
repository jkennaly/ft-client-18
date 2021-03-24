// src/componenets/fields/Icon.jsx

import m from 'mithril'

const Icon = {
	view: ({ attrs }) =>
		<div class="ft-icon-div" >
			{m.trust(`<svg class="ft-icon icon icon-${attrs.name} ${attrs.classes ? attrs.classes : ''}"><use xlink:href="img/symbol-defs.svg#icon-${attrs.name}"></use></svg>`)}
		</div>
}

export default Icon