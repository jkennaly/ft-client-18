// ComposedNameField.jsx

const m = require("mithril");

const ComposedNameField = {
	view: ({ attrs }) =>
		<span class="ft-field">
			{attrs.fieldValue}
		</span >
};

export default ComposedNameField;