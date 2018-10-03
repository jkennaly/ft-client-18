// LauncherBanner.jsx

const m = require('mithril');

import StageTitle from './StageTitle.jsx';
import DisplayButton from './DisplayButton.jsx';


const LauncherBanner = {
	view: ({ attrs }) =>
		<div class="stage-banner-container">
		<div class="stage-banner">
			<StageTitle title={attrs.title} />


			<DisplayButton icon={<i class="fas fa-bars"/>} />
		</div>
	</div>
};

export default LauncherBanner;