// ArtistMerge.jsx


import m from 'mithril'
import _ from 'lodash'

// change selections
import UIButton from '../../../../components/ui/UIButton.jsx';
import ArtistSelector from '../../../../components/detailViewsPregame/fields/artist/ArtistSelector.jsx'
import {remoteData} from '../../../../store/data';

const classes = attrs => 'launcher-container ' + (attrs.display ? '' : 'hidden')
var textValue = ''
var selectedId1 = 0
var selectedId2 = 0
var resultPos = 0
const ArtistMerge = {
        oninit: () => {
            remoteData.Artists.loadList()
        },
	view: ({attrs}) => <div class={classes(attrs)}>

            <ArtistSelector 
                label="Select first artist to merge"
                defaultText="merge artist"
                artistChange={e => selectedId1 = parseInt(e.target.value, 10)}
            />
            <ArtistSelector 
                label="Select second artist to merge"
                defaultText="merge artist"
                artistChange={e => selectedId2 = parseInt(e.target.value, 10)}
            />
            <div class="ft-name-field">
                <label for="result-id">
                    {`Name of merged artist:`}
                </label>
                    <select id="result-id" name="result-id" onchange={e => resultPos = parseInt(e.target.value, 10)}>
                        {selectedId1 ? <option value={1} >{remoteData.Artists.get(selectedId1).name}</option> : ''}
                        {selectedId2 ? <option value={2} >{remoteData.Artists.get(selectedId2).name}</option> : ''}

                    </select>
            </div>
            <UIButton action={e => {

                remoteData.Artists.merge(selectedId1, selectedId2)
                    .then(r => m.redraw())
                
            }} buttonName="Accept" />
        </div>
};

export default ArtistMerge;