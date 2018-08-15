// DisplayBar.jsx

const m = require("mithril");

import DisplayButton from '../ui/DisplayButton.jsx';

const DisplayBar = {
	view: () =>
		<div class="nav-bar">
			<DisplayButton display={'perspective'} icon={<i class="fas fa-eye"/>} />
			<DisplayButton display={'context'} icon={<i class="fas fa-clock"/>} />
		</div>
};

export default DisplayBar;