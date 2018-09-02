// ComposedNameField.jsx

const m = require("mithril");

const ComposedNameField = {
	view: ({ attrs }) =>
		<div class="ft-field">
			{attrs.fieldValue}
		</div >
};

export default ComposedNameField;