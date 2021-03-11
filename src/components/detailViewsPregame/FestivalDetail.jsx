// src/components/detailViewsPregame/FestivalDetail.jsx

import m from "mithril";
import _ from "lodash";

import CardContainer from "../../components/layout/CardContainer.jsx";
import SeriesCard from "../../components/cards/SeriesCard.jsx";
import DateCard from "../../components/cards/DateCard.jsx";
import NavCard from "../../components/cards/NavCard.jsx";
import ArtistCard from "../../components/cards/ArtistCard.jsx";

import WidgetContainer from "../../components/layout/WidgetContainer.jsx";
import FixedCardWidget from "../../components/widgets/FixedCard.jsx";
import ResearchWidget from "../../components/widgets/canned/ResearchWidget.jsx";
import LineupWidget from "../../components/widgets/canned/LineupWidget.jsx";
import ActivityWidget from "../../components/widgets/canned/ActivityWidget.jsx";
import IntentToggle from "../../components/ui/canned/IntentToggle.jsx";

import SeriesWebsiteField from './fields/series/SeriesWebsiteField.jsx'

import { remoteData } from "../../store/data";

const festivals = remoteData.Festivals

const id = () => parseInt(m.route.param('id'), 10)
const user = attrs => _.isInteger(attrs.user) ? attrs.user : 0
const roles = attrs => _.isArray(attrs.userRoles) ? attrs.userRoles : []

const FestivalDetail = {
	name: 'FestivalDetail',
	preload: (rParams) => {
		//if a promise returned, instantiation of component held for completion
		//route may not be resolved; use rParams and not m.route.param
		const festivalId = parseInt(rParams.id, 10)
		//messages.forArtist(festivalId)
		///console.log('FestivalDetail preload', festivalId, rParams)
		if(festivalId) return festivals.subjectDetails({subject: festivalId, subjectType: FESTIVAL})

	},
		oninit: ({attrs}) => {

			if (attrs.titleSet) attrs.titleSet(festivals.getEventName(id()))
				console.log('oninit', attrs.eventSet)
			if (attrs.eventSet) attrs.eventSet('hasAccess')

		},
		view: ({attrs}) => (
			<div class="main-stage">
				{id() ? <SeriesWebsiteField festivalId={id()} /> : ''}
				{id() ? (
					<IntentToggle
						subjectObject={{
							subject: id(), 
							subjectType: FESTIVAL
						}}
						permission={roles(attrs).includes('user')}
					/>
				) : (
					""
				)}

				<WidgetContainer>
					<LineupWidget festivalId={id()} />
					<ActivityWidget 
						festivalId={id()} 
						userId={attrs.userId} 
						popModal={attrs.popModal} 
					/>
					<ResearchWidget list={[]} userId={attrs.userId} popModal={attrs.popModal} />
					<FixedCardWidget header="Related Events">
						{(remoteData.Dates.getMany(
							festivals.getSubIds(id()))
						)
							.sort((a, b) => a.basedate - b.basedate)
							.map(data => (
								<DateCard eventId={data.id} />
							))}
						<SeriesCard
							data={(remoteData.Series.get(
							festivals.getSuperId(
								id()))
						)}
							eventId={(
							festivals.getSuperId(
								id()))}
						/>
					</FixedCardWidget>
				</WidgetContainer>
			</div>
		)

};
export default FestivalDetail;
