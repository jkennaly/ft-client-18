// src/componenets/fields/NameField.jsx

import m from 'mithril'

const NameField = {
	view: ({ attrs }) =>
		<span class="ft-name-field">
			{attrs.fieldValue}
		</span >
};

export default NameField;