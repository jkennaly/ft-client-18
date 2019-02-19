// 	SetStages.jsx
// Services
import Auth from '../../../services/auth.js';
const auth = new Auth();



import m from 'mithril'
import _ from 'lodash'
const dragula = require("dragula");
const Promise = require('promise-polyfill').default

import LauncherBanner from '../../../components/ui/LauncherBanner.jsx';
import WidgetContainer from '../../../components/layout/WidgetContainer.jsx';
import FixedCardWidget from '../../../components/widgets/FixedCard.jsx';
import NavCard from '../../../components/cards/NavCard.jsx';
import EventSelector from '../../detailViewsPregame/fields/event/EventSelector.jsx'
import UIButton from '../../ui/UIButton.jsx';
import TextEntryModal from '../../modals/TextEntryModal.jsx';

import {remoteData} from '../../../store/data';

const captureStages = (els, festivalId, userId) => {
	//console.log(els)
	const stageData = _.reduce(els, (pv, el, i) => { 
		pv.push({
			name: el.textContent, 
			priority: i + 1,
			festival: festivalId,
			type: 1,
			user: userId
		})
		return pv
	}, [])
	//console.log(stageData)
	const deleteStages = remoteData.Places.list
		.filter(p => p.type === 1)
		.filter(p => p.festival === festivalId)
		.filter(p => !_.some(stageData, {name: p.name, festival: festivalId}))


	const addPromise = remoteData.Places.stagesForFestival(stageData, festivalId)
	const delPromise = remoteData.Places.batchDelete(deleteStages)

	Promise.all([addPromise, delPromise])
		.then(() => console.log('captureStages promises resolved'))
		.then(m.redraw)

}

const SetStages = (vnode) => { 
	var seriesId = 0
	var festivalId = 0
	var dateId = 0
	var userId = 0
	var currentStages = {}
	var prevStages = {}
	var allStages = {}
	var newStageNames = []
	var addingStage = false
	var drake = {}
	const clearMovedStages = e => {
		while (currentStages.firstChild) {
		    currentStages.removeChild(currentStages.firstChild)
	}}
	const seriesChange = e => {
		//console.log(e.target.value)
		seriesId = parseInt(e.target.value, 10)
		festivalId = 0
		//resetSelector('#festival')
		dateId = 0
		newStageNames = []
		clearMovedStages()

		//resetSelector('#date')
	}
	const festivalChange = e => {
		//console.log(e.target.value)
		festivalId = parseInt(e.target.value, 10)
		dateId = 0
		newStageNames = []
		clearMovedStages()

		//resetSelector('#date')
	}
	const copyPreviousStages = () => {
		const prevStages = remoteData.Places.prevPlaces(festivalId)
		//console.log('copyPreviousStages')
		//console.log(prevStages)
		newStageNames = prevStages.map(p => p.name)
	}

	return {
		oncreate: vnode => {
			currentStages = vnode.dom.children[2].children[0].children[0].children[1]
			drake = dragula([
				currentStages,
				vnode.dom.children[2].children[0].children[1].children[1],
				vnode.dom.children[2].children[0].children[2].children[1],
			])
		},
		oninit: () => {
			userId = auth.userId()
		},
		view: () => 
		<div class="launcher-container">
			<div class="stage-banner-container">
				<LauncherBanner 
					action={() => auth.logout()}
					title="Set up Stages" 
				>
					<EventSelector 
						seriesId={seriesId}
						festivalId={festivalId}
						seriesChange={seriesChange}
						festivalChange={festivalChange}
					/>
				</LauncherBanner>
			</div>
			<div>
				<UIButton action={e => addingStage = true} buttonName="New Stage" />
	  			<UIButton action={copyPreviousStages} buttonName="Copy previous stages" />
			</div>
				<div class="main-stage-content-scroll">
				<WidgetContainer>
					<FixedCardWidget header="Current Stage Order">
						{
							(!newStageNames.length ? [] : newStageNames)
								.map(p => <NavCard fieldValue={p} key={p}/>)
						}
						{!festivalId ? [] : remoteData.Places.forFestival(festivalId)
							.map(p => 
								<NavCard fieldValue={p.name} key={p.id}/>
						)}
					</FixedCardWidget>
					<FixedCardWidget header="Previous Stages">
						{!festivalId ? [] : _.uniqBy(remoteData.Places.list
													.filter(p => remoteData.Festivals.getPeerIds(festivalId).indexOf(p.festival) > -1), x => x.name)
							.map(p => 
								<NavCard fieldValue={p.name} key={p.id}/>
						)}
					</FixedCardWidget>
					<FixedCardWidget header="All Stages">
						{_.uniqBy(remoteData.Places.list, x => x.name).map(p => 
							<NavCard fieldValue={p.name} key={p.id}/>
						)}
					</FixedCardWidget>
				</WidgetContainer>
			</div>
			<TextEntryModal 
				prompt="New Stage Name" 
				display={addingStage} 
				action={newText => {
					//console.log('New Stage Name newText')
					//console.log(newText)
					newStageNames.push(newText)
				}}
				hide={() => addingStage = false}
			/>
			<UIButton action={e => captureStages(currentStages.children, festivalId, userId)} buttonName="SAVE" />
	  
		</div>
}}
export default SetStages;
