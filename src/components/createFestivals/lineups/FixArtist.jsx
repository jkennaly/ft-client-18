// 	FixArtist.jsx
// Services
import Auth from '../../../services/auth.js';
const auth = new Auth();



import m from 'mithril'
import _ from 'lodash'
const Promise = require('promise-polyfill').default

import LauncherBanner from '../../../components/ui/LauncherBanner.jsx';

import ArtistSpelling from '../../detailViewsPregame/fields/artist/ArtistSpelling.jsx'
import ArtistMerge from '../../detailViewsPregame/fields/artist/ArtistMerge.jsx'


import {remoteData} from '../../../store/data';

const FixArtist = (vnode) => { 
	var artistId = 0
	var select = ''
	var fixType = 0
	const fixTypeChange = e => {
		//console.log(e.target.value)
		fixType = parseInt(e.target.value, 10)
		const artistString = artistId ? '/' + artistId : ''
		const fixString = fixType ? (fixType === 1 ? '?type=spelling' : '?type=merge') : ''
		m.route.set('/artists/pregame/fix' + artistString + fixString)
	}
	return {
		oninit: () => {
			artistId = parseInt(m.route.param('id'), 10)
			select = m.route.param('type')
			fixType = select ? (select === 'spelling' ? 1 : (select === 'merge' ? 2 : 0) ) : 0
	
			userId = auth.userId()
		},
		view: () => 
		<div class="launcher-container">
			<div class="stage-banner-container">
				<LauncherBanner 
					action={() => auth.logout()}
					title="Fix Artist Names" 
				/>
			</div>
				<div class="main-stage-content-scroll">
			<div class="ft-name-field">
				<label for="fix-type">
			        {`Select the type of fix to make:`}
			    </label>
				    <select id="fix-type" name="fix-type" onchange={fixTypeChange}>
				    	<option value={0} selected={!select ? "selected" : false}>{`Type of fix`}</option>
						<option value={1} selected={select === 'spelling' ? "selected" : false}>{`Spelling`}</option>
						<option value={2} selected={select === 'merge' ? "selected" : false}>{`Merge`}</option>

			    	</select>
			</div>
			<ArtistSpelling display={fixType === 1} sel={artistId} />
			<ArtistMerge display={fixType === 2} sel={artistId} />
		</div>
		</div>
}}
export default FixArtist;
