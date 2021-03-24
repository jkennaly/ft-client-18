// src/components/layout/DisplayBar.jsx

import m from 'mithril'

import DisplayButton from '../ui/DisplayButton.jsx';
import Icon from '../fields/Icon.jsx'

const DisplayBar = {
	view: () =>
		<div class="nav-bar">
			<DisplayButton icon={<Icon name="menu" />} />
		</div>
};

export default DisplayBar;