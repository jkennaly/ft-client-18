// src/components/fields/SearchField.jsx

import m from 'mithril'

const SearchField = {
  view: ({ attrs }) =>
    <div class="c44-search-field">
    	<label class="hidden" for="search-input">Search</label>
      	<input type="text" class="c44-search-field-input" oninput={e => attrs.patternChange(e.target.value)} name="search-input" placeholder={`\uF002${attrs.ph ? attrs.ph : ''}`} />
    </div>
};

export default SearchField;