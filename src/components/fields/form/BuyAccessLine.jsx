// src/components/fields/form/BuyAccessLine.jsx

//a form field for updating a string value

import m from 'mithril'

const jsx = {
  view: ({ attrs }) =>
    <div class={`ft-buy-access-line c44-df c44-fjcc`}>
    	<button class={`c44-w-100${attrs.unaffordable ? ' c44-bcg' : ''}`} onclick={attrs.unaffordable ? e => {} : attrs.clickFunction}>
	    	{attrs.name}
	    	<br />
	    	{attrs.subtitle}
	    	<br />
	    	<i class="fas fa-coins" />
	    	{attrs.value}
    	</button>
    </div>
}

const BuyAccessLine = {
	view: ({attrs}) => {
		//console.log('BuyAccessLine', attrs)
		const mapping = {
			accessLevel: attrs.accessLevel,
			name: attrs.name,
			subtitle: attrs.subtitle,
			value: attrs.value,
			clickFunction: attrs.clickFunction,
			unaffordable: attrs.unaffordable
		}

		return m(jsx, mapping)
	}
}

export default BuyAccessLine;