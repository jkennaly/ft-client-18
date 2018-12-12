// SortButton.jsx
// attrs:
//	bannerMenu
//	icon
//	idFields

import m from 'mithril'

import CollapsibleMenu from './CollapsibleMenu.jsx';

// Local state
import {getAppPerspective} from '../../store/ui';
import {getAppContext} from '../../store/ui';

// possible state
import {setSortName} from '../../store/ui';
import {getSortName} from '../../store/ui';
import {getAllSortNames} from '../../store/ui';

// active selections
import {selected} from '../../store/ui';

// change selections
import {toggleSelection} from '../../store/ui';

const hideDisplay = attrs => selected.indexOf('sort') < 0
const SortButton = {
	view: ({ attrs }) =>
		<div class="ft-banner-button-container">
			<CollapsibleMenu 
				menu={getAllSortNames(getAppContext(), getAppPerspective())} 
				menuName={'sort'}
				collapsed={hideDisplay(attrs)} 
				selected={getSortName(getAppContext(), getAppPerspective())} 
				stateChange={setSortName(getAppContext(), getAppPerspective())}
				bannerMenu={attrs.bannerMenu}
				idFields={attrs.idFields}
			/>
			<div class="banner-button" onclick={() => {toggleSelection('sort')}}>
			<span>
				{getSortName(getAppContext(), getAppPerspective())}
			</span>
				{attrs.icon}
			</div>
		</div>
};

export default SortButton;