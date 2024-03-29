// src/components/fields/SearchField.jsx

import m from "mithril"

const SearchField = {
	oncreate: ({ dom }) => {
		//console.log("search field created")
		dom.querySelector("input").focus()
	},
	view: ({ attrs }) => (
		<div class="ft-search-field">
			<label class="hidden" for="search-input">
				Search
			</label>
			<input
				type="text"
				class="ft-search-field-input"
				//onfocusout={attrs.fieldBlur ? attrs.fieldBlur : () => {}}
				//onfocus={attrs.fieldFocus ? attrs.fieldFocus : () => {}}
				oninput={e => attrs.patternChange(e.target.value)}
				name="search-input"
			/>
		</div>
	),
}

export default SearchField
