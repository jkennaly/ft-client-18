// src/components/createFestivals/lineups/AddSingleArtist.jsx




import m from 'mithril'
import _ from 'lodash'
import UIButton from '../../../components/ui/UIButton.jsx';

import {remoteData} from '../../../store/data'

const artists = remoteData.Artists
const lineups = remoteData.Lineups

var addingArtist = false
const AddSingleArtist = {
		oninit: ({attrs}) => {
			return Promise.all([
				lineups.remoteCheck(true),
				artists.remoteCheck(true)
				])
		},
		view: ({attrs}) => <div>
		<UIButton action={() => {
			attrs.popModal('artist', {
				festivalId: attrs.festivalId,
				action: x => x
			})
		}} buttonName="Add Single Artist" />

		</div>
}
export default AddSingleArtist;
