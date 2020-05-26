// src/components/layout/ScheduleThemer.jsx

const dragula = require("dragula");

import m from 'mithril'
import _ from 'lodash'

import WidgetContainer from '../../components/layout/WidgetContainer.jsx'
import ActivityCard from '../../components/cards/ActivityCard.jsx'
import FixedCardWidget from '../../components/widgets/FixedCard.jsx'


import {remoteData} from '../../store/data';
import {subjectData} from '../../store/subjectData'
var drake = {}

const ScheduleThemer = {
	name: 'ScheduleThemer',
	preload: (rParams) => {
			
		},
	oninit: ({attrs}) => {
		if (attrs.titleSet) attrs.titleSet(`Schedule Themer`)
	},
	view: ({attrs}) => {

		const mapping = {
			}
			//console.log(`ScheduleThemer mapping`, mapping)
		return m({
			oncreate: vnode => {
				drake = dragula([].slice.call(vnode.dom.querySelectorAll(`.c44-widget-dragula`)))
			},
			view: ({attrs}) => <div class="c44-main-stage">
			{
				//console.log(`ScheduleThemer attrs`, attrs)
			}
				

				<div class="c44-main-stage-content-scroll">
				<WidgetContainer>
					<FixedCardWidget header="Score Types" containerClasses={'c44-widget-dragula'}>
					</FixedCardWidget>
					<FixedCardWidget header="Applied Scores" containerClasses={'c44-widget-dragula'}>
					</FixedCardWidget>
					<FixedCardWidget header="Palettes" containerClasses={'c44-widget-dragula'}>
					</FixedCardWidget>
				</WidgetContainer>
				</div>

			</div>
		}, mapping)
	}
}
export default ScheduleThemer;
