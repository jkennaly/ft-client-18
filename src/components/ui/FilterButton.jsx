// FilterButton.jsx
// attrs:
//	bannerMenu
//	icon
//	idFields

const m = require("mithril");

import CollapsibleMenu from './CollapsibleMenu.jsx';

// Local state
import {getAppPerspective} from '../../store/ui';
import {getAppContext} from '../../store/ui';

// possible state
import {setFilterNames} from '../../store/ui';
import {getFilterNames} from '../../store/ui';
import {getAllFilterNames} from '../../store/ui';

// active selections
import {selected} from '../../store/ui';

// change selections
import {toggleSelection} from '../../store/ui';

const hideDisplay = attrs => selected.indexOf('filter') < 0
const FilterButton = {
	view: ({ attrs }) =>
		<div class="ft-banner-button-container">
			<CollapsibleMenu 
				menu={getAllFilterNames(getAppContext(), getAppPerspective())} 
				menuName={'filter'}
				collapsed={hideDisplay(attrs)} 
				selected={getFilterNames(getAppContext(), getAppPerspective())[0]} 
				stateChange={setFilterNames(getAppContext(), getAppPerspective())}
				bannerMenu={attrs.bannerMenu}
				idFields={attrs.idFields}
			/>
			<div class="banner-button" onclick={() => {toggleSelection('filter')}}>
			<span>
				{getFilterNames(getAppContext(), getAppPerspective())}
			</span>
				{attrs.icon}
			</div>
		</div>
};

export default FilterButton;