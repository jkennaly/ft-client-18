// NameField.jsx

const m = require("mithril");

const NameField = {
	view: ({ attrs }) =>
		<div class="ft-name-field">
			{attrs.fieldValue}
		</div >
};

export default NameField;