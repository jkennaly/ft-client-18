// SearchField.jsx

import m from 'mithril'

const SearchField = {
  view: ({ attrs }) =>
    <span class="ft-search-field">
    	<label class="hidden" for="search-input">Search</label>
      	<input type="text" oninput={e => attrs.patternChange(e.target.value)} name="search-input" placeholder="Search" />
    </span>
};

export default SearchField;