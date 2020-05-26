// src/components/layout/DisplayBar.jsx

import m from 'mithril'

import DisplayButton from '../ui/DisplayButton.jsx';

const DisplayBar = {
	view: () =>
		<div class="nav-bar">
			<DisplayButton icon={<i class="fas fa-bars"/>} />
		</div>
};

export default DisplayBar;