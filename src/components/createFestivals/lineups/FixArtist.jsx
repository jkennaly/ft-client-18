// 	FixArtist.jsx
// Services
import Auth from '../../../services/auth.js';
const auth = new Auth();



const m = require("mithril");
const _ = require("lodash");
const Promise = require('promise-polyfill').default

import LauncherBanner from '../../../components/ui/LauncherBanner.jsx';

import ArtistSpelling from '../../detailViewsPregame/fields/artist/ArtistSpelling.jsx'
import ArtistMerge from '../../detailViewsPregame/fields/artist/ArtistMerge.jsx'


import {remoteData} from '../../../store/data';

const FixArtist = (vnode) => { 
	var fixType = 0
	const fixTypeChange = e => {
		//console.log(e.target.value)
		fixType = parseInt(e.target.value, 10)
		m.redraw()
	}
	return {
		oninit: () => {
			remoteData.Artists.loadList()
			remoteData.ArtistAliases.loadList()
			auth.getFtUserId()
				.then(m.redraw)
				.catch(console.log)
		},
		view: () => 
		<div class="launcher-container">
			<div class="stage-banner-container">
				<LauncherBanner 
					action={() => auth.logout()}
					title="Fix Artist Names" 
				/>
			</div>
			<div class="ft-name-field">
				<label for="fix-type">
			        {`Select the type of fix to make:`}
			    </label>
				    <select id="fix-type" name="fix-type" onchange={fixTypeChange}>
				    	<option value={0} selected="selected">{`Type of fix`}</option>
						<option value={1} >{`Spelling`}</option>
						<option value={2} >{`Merge`}</option>

			    	</select>
			</div>
			<ArtistSpelling display={fixType === 1} />
			<ArtistMerge display={fixType === 2} />
		</div>
}}
export default FixArtist;
