// src/componenets/fields/NameField.js

import m from 'mithril'

const NameField = {
	view: ({ attrs }) => m('span.ft-name-field', [attrs.fieldValue])
};

export default NameField;