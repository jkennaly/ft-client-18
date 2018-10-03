// 	ArtistSpelling.jsx
// Services
import Auth from '../../../../services/auth.js';
const auth = new Auth();



const m = require("mithril");
const _ = require("lodash");
const dragula = require("dragula");
const Promise = require('promise-polyfill').default

import WidgetContainer from '../../../../components/layout/WidgetContainer.jsx';
import FixedCardWidget from '../../../../components/widgets/FixedCard.jsx';
import NavCard from '../../../../components/cards/NavCard.jsx';
import ArtistSelector from '../../../detailViewsPregame/fields/artist/ArtistSelector.jsx'
import UIButton from '../../../ui/UIButton.jsx';
import TextEntryModal from '../../../ui/TextEntryModal.jsx';

import {remoteData} from '../../../../store/data';

const getText = (pv, el) => pv.concat([el.textContent])
const captureArtistNames = (displayNameEls, otherNamesEls, removeNamesEls, artistId, userId) => {
	//console.log(displayNameEls)
	if(displayNameEls.length !== 1) return
	const artist = remoteData.Artists.get(artistId)
	const newName = displayNameEls[0].textContent
	const nameChanged = artist.name !== newName
	const artistAliases = remoteData.ArtistAliases.forArtist(artistId)
	const existingAliases = artistAliases
		.map(x => x.alias)
	const newAliases = _.reduce(otherNamesEls, getText, [])
		.filter(n => existingAliases.indexOf(n) < 0)
		.map(n => { return {
			alias: n,
			band: artistId,
			user: userId
		}})
	const removeAliases = _.reduce(removeNamesEls, getText, [])
		.map(n => existingAliases.indexOf(n))
		.filter(i => i > -1)
		.map(i => artistAliases[i].id)

	//update artist if nameChanged
	console.log('nameChanged: ' + nameChanged)
	console.log(newAliases)
	console.log(removeAliases)
	//batchCreate newAliases
	//batchDelete removeAliases


	const updPromise = nameChanged ? remoteData.Artists.update({name: newName, user: userId}, artistId) : Promise.resolve(true)
	const addPromise = remoteData.ArtistAliases.batchCreate(newAliases, artistId)
	const delPromise = remoteData.ArtistAliases.batchDelete(removeAliases)

	Promise.all([addPromise, delPromise, updPromise])
		.then(() => console.log('captureArtistNames promises resolved'))
		.then(m.redraw)

}

const classes = attrs => 'launcher-container ' + (attrs.display ? '' : 'hidden')
const ArtistSpelling = (vnode) => { 
	var artistId = 0
	var artist = {}
	var userId = 0
	var displayName = {}
	var otherNames = {}
	var removeNames = {}
	var lastTarget = {}
	var displayNameCount = 0
	var prevStages = {}
	var allStages = {}
	var newArtistNames = []
	var addingName = false
	var drake = {}
	const drakeDrop = function(el, target, source, sibling) {
		lastTarget = target
		m.redraw()
    }
	const clearMovedStages = e => {
		while (displayName.firstChild) {
		    displayName.removeChild(displayName.firstChild)
	}}
	const artistChange = e => {
		//console.log(e.target.value)
		artistId = parseInt(e.target.value, 10)
		artist = remoteData.Artists.get(artistId)
		newArtistNames = []
		clearMovedStages()
		m.redraw()

		//resetSelector('#date')
	}

	return {
		oncreate: vnode => {
			displayName = vnode.dom.children[2].children[0].children[0].children[1]
			otherNames = vnode.dom.children[2].children[0].children[1].children[1]
			removeNames = vnode.dom.children[2].children[0].children[2].children[1]
			drake = dragula([
				displayName,
				otherNames,
				removeNames
			])
			
			.on('drop', drakeDrop);
		    
		},
		oninit: () => {
			remoteData.Artists.loadList()
			remoteData.ArtistAliases.loadList()
			auth.getFtUserId()
				.then(id => userId = id)
				.then(m.redraw)
				.catch(console.log)
		},
		view: ({attrs}) => 
		<div class={classes(attrs)}>
			<ArtistSelector 
				label="Drag the artist names between boxes to fix:"
				artistChange={artistChange}
			/>
			<div>
				<UIButton action={e => addingName = true} buttonName="New Name" />
	  		</div>
			<div>
				<WidgetContainer>
					<FixedCardWidget header="Display Name">
						{artistId ? <NavCard fieldValue={artist.name} /> : ''}
					</FixedCardWidget>
					<FixedCardWidget header="Other Names">
						{
							(artistId ? remoteData.ArtistAliases.forArtist(artistId).map(x => x.alias) : []).concat(newArtistNames)
								.map(p => <NavCard fieldValue={p} />)
						}
					</FixedCardWidget>
					<FixedCardWidget header="Remove Names">
						{}
					</FixedCardWidget>
				</WidgetContainer>
			</div>
			<TextEntryModal 
				prompt="New Artist Name" 
				display={addingName} 
				action={newText => {
					//console.log('New Artist Name newText')
					//console.log(newText)
					newArtistNames.push(newText)
				}}
				hide={() => addingName = false}
			/>
			<div>Display Name Length: {displayName.children ? displayName.children.length : 'NA'}</div>
			{displayName.children && displayName.children.length === 1 ? 
				<UIButton action={e => captureArtistNames(displayName.children, otherNames.children, removeNames.children, artistId, userId)} buttonName="SAVE" /> :
				<UIButton action={() => 0} buttonName="SAVE only with exactly one display name" />
			}
	  
		</div>
}}
export default ArtistSpelling;
