// DisplayButton.jsx

const m = require("mithril");

import CollapsibleMenu from './CollapsibleMenu.jsx';

// possible state
import {getAllPerspectives} from '../../store/ui';
import {getAllContexts} from '../../store/ui';

const possibleStates = {
	perspective: getAllPerspectives,
	context:  getAllContexts
};

// Local state
import {getAppPerspective} from '../../store/ui';
import {getAppContext} from '../../store/ui';

const localState = {
	perspective: getAppPerspective,
	context:  getAppContext
};

// change state
import {setAppPerspective} from '../../store/ui';
import {setAppContext} from '../../store/ui';

const newState = {
	perspective: setAppPerspective,
	context:  setAppContext
};

// active selections
import {selected} from '../../store/ui';

// change selections
import {toggleSelection} from '../../store/ui';

const allStates = attrs => possibleStates[attrs.display]
const currentState = attrs => localState[attrs.display]
const changeState = attrs => val => newState[attrs.display](val)
const hideDisplay = attrs => selected.indexOf(attrs.display) < 0
const DisplayButton = {
	view: ({ attrs }) =>
		<div>
			<CollapsibleMenu 
				menu={allStates(attrs)()} 
				collapsed={hideDisplay(attrs)} 
				selected={currentState(attrs)()} 
				stateChange={changeState(attrs)}
			/>
			<div class="nav-button" onclick={() => {console.log('click'); toggleSelection(attrs.display)}}>
				{attrs.icon}
				<div>
					{currentState(attrs)()}
				</div>
			</div>
		</div>
};

export default DisplayButton;