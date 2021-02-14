// src/components/fields/form/BuyAccessLine.jsx

//a form field for updating a string value

import m from 'mithril'

const jsx = {
  view: ({ attrs }) =>
    <div class="ft-buy-access-line c44-df c44-fjcc">
    	<button onclick={attrs.clickFunction}>{`Buy ${attrs.name} Access for ${attrs.value} FestiBucks`}</button>
    </div>
}

const BuyAccessLine = {
	view: ({attrs}) => {
		//console.log('BuyAccessLine', attrs)
		const mapping = {
			accessLevel: attrs.accessLevel,
			name: attrs.name,
			value: attrs.value,
			clickFunction: attrs.clickFunction
		}

		return m(jsx, mapping)
	}
}

export default BuyAccessLine;