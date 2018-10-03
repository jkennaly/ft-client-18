// NameField.jsx

const m = require("mithril");

const NameField = {
	view: ({ attrs }) =>
		<span class="ft-name-field">
			{attrs.fieldValue}
		</span >
};

export default NameField;