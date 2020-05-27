// 	SetStages.jsx
// Services
import Auth from '../../../services/auth.js';
const auth = new Auth();



import m from 'mithril'
import _ from 'lodash'
const dragula = require("dragula");

import WidgetContainer from '../../../components/layout/WidgetContainer.jsx';
import FixedCardWidget from '../../../components/widgets/FixedCard.jsx';
import NavCard from '../../../components/cards/NavCard.jsx';
import EventSelector from '../../detailViewsPregame/fields/event/EventSelector.jsx'
import UIButton from '../../ui/UIButton.jsx';
import TextEntryModal from '../../modals/TextEntryModal.jsx';
import SeriesWebsiteField from '../../detailViewsPregame/fields/series/SeriesWebsiteField.jsx'

import {remoteData} from '../../../store/data';
import {seriesChange, festivalChange} from '../../../store/action/event'

const captureStages = (els, festivalId) => {
	//console.log(els)
	const stageData = _.reduce(els, (pv, el, i) => { 
		pv.push({
			name: el.textContent, 
			priority: i + 1,
			festival: festivalId,
			type: 1
		})
		return pv
	}, [])
	//console.log(stageData)
	const deleteStages = remoteData.Places.list
		.filter(p => p.type === 1)
		.filter(p => p.festival === festivalId)
		.filter(p => !_.some(stageData, {name: p.name, festival: festivalId}))


	const addPromise = stageData.length ? remoteData.Places.batchCreate(stageData, festivalId) : undefined
	const delPromise = deleteStages.length ? remoteData.Places.batchDelete(deleteStages) : undefined

	Promise.all([addPromise, delPromise])
		//.then(() => console.log('captureStages promises resolved'))


}
const {Series: series, Festivals: festivals, Dates: dates, Places: places, Sets: sets} = remoteData

const seriesId = () => parseInt(m.route.param('seriesId'), 10)
const festivalId = () => parseInt(m.route.param('festivalId'), 10)
const dateId = () => parseInt(m.route.param('dateId'), 10)
const SetStages = (vnode) => { 
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
	const seriesChangea = e => {
		clearMovedStages()
		return seriesChange(e)

		//resetSelector('#date')
	}
	const festivalChangea = seriesId => e => {
		newStageNames = []
		clearMovedStages()
		return festivalChange(seriesId)(e)

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
			currentStages = vnode.dom.querySelector(`.ft-card-container`)
			drake = dragula(
				[].slice.call(vnode.dom.querySelectorAll(`.ft-widget-dragula`))
			)
		
		},
		oninit: ({attrs}) => {
			if (attrs.titleSet) attrs.titleSet(`Set up Stages`)

			return Promise.all([
				festivalId() ? places.maintainList({where: {festival: {inq: series.getSubFestivalIds(seriesId())}}}) : [],
				dateId() ? sets.maintainList({where: {day: {inq: dates.getSubDayIds(dateId)}}}) : true
			
			])
		},
		view: () => 
		<div class="launcher-container">
			<div class="ft-stage-banner-container">
					<EventSelector 
						seriesId={seriesId()}
						festivalId={festivalId()}
						seriesChange={seriesChangea}
						festivalChange={festivalChangea(seriesId())}
					/>
			</div>
			<SeriesWebsiteField id={seriesId()} />
			<div>
				<UIButton action={e => addingStage = true} buttonName="New Stage" />
	  			<UIButton action={copyPreviousStages} buttonName="Copy previous stages" />
				<UIButton action={e => captureStages(currentStages.children, festivalId())} buttonName="SAVE" />
		  </div>
				<div class="main-stage-content-scroll">
				<WidgetContainer>
					<FixedCardWidget header="Current Stage Order" containerClasses={'ft-widget-dragula'} tall={true}>
						{
							(!newStageNames.length ? [] : newStageNames)
								.map(p => <NavCard fieldValue={p} key={p}/>)
						}
						{!festivalId() ? [] : remoteData.Places.forFestival(festivalId())
							.map(p => 
								<NavCard fieldValue={p.name} key={p.id}/>
						)}
					</FixedCardWidget>
					<FixedCardWidget header="Previous Stages" containerClasses={'ft-widget-dragula'} tall={true}>
						{!festivalId() ? [] : _.uniqBy(remoteData.Places.list
													.filter(p => remoteData.Festivals.getPeerIds(festivalId()).indexOf(p.festival) > -1), x => x.name)
							.map(p => 
								<NavCard fieldValue={p.name} key={p.id}/>
						)}
					</FixedCardWidget>
				{/*
					<FixedCardWidget header="All Stages" containerClasses={'ft-widget-dragula'} tall={true}>
						{_.uniqBy(remoteData.Places.list, x => x.name).map(p => 
							<NavCard fieldValue={p.name} key={p.id}/>
						)}
					</FixedCardWidget>
					*/}
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
		</div>
}}
export default SetStages;
