// src/components/createFestivals/lineups/AddSingleArtist.jsx




import m from 'mithril'
import _ from 'lodash'
import ArtistEntryModal from '../../modals/ArtistEntryModal.jsx'
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
		<UIButton action={() => addingArtist = true} buttonName="Add Single Artist" />

		<ArtistEntryModal 
			display={addingArtist} 
			hide={() => addingArtist = false}
			action={artistPromise => artistPromise}
			festivalId={attrs.festivalId}
		/>
		</div>
}
export default AddSingleArtist;
