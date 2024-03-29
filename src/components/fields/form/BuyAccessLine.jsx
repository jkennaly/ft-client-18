// src/components/fields/form/BuyAccessLine.jsx

//a form field for updating a string value

import m from 'mithril'
import IconText from '../IconText.jsx'

const jsx = {
  view: ({ attrs }) =>
    <div class={`ft-buy-access-line c44-df c44-fjcc`}>
    	<button 
    		class={`c44-w-100${attrs.unaffordable ? ' c44-bcg' : ''}`} 
    		onclick={attrs.unaffordable ? e => {} : attrs.clickFunction}
    		data-access-level={attrs.accessLevel}
    	>
	    	{attrs.name}
	    	<br />
	    	{attrs.subtitle}
	    	<br />
	    	<IconText name="festibucks" />
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