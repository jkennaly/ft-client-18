// src/components/fields/form/StringUpdate.jsx

//a form field for updating a string value

import m from 'mithril'

const jsx = {
  view: ({ attrs }) =>
    <div class="ft-string-update-field">
    	<label class="" for={`string-input-${attrs.keyField}`}>{attrs.name}</label>
      	<input 
      		type="text" 
      		class="ft-search-field-input" 
      		onfocusout={attrs.fieldBlur ? attrs.fieldBlur : () => {}}
      		onfocus={attrs.fieldFocus ? attrs.fieldFocus : () => {}}
      		oninput={e => attrs.patternChange(e.target.value)} 
      		name={`string-input-${attrs.keyField}`} 
      		value={attrs.value} 
      	/>
    </div>
}

const StringUpdate = {
	view: ({attrs}) => {
		//console.log('StringUpdate', attrs)
		const mapping = {
			keyField: attrs.keyField,
			fieldBlur: attrs.fieldBlur,
			fieldFocus: attrs.fieldFocus,
			patternChange: attrs.patternChange,
			name: attrs.name,
			value: attrs.value
		}

		return m(jsx, mapping)
	}
}

export default StringUpdate;