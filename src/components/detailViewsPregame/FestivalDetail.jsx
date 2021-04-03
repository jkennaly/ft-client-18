// src/components/detailViewsPregame/FestivalDetail.jsx

import m from "mithril"
import _ from "lodash"

import CardContainer from "../../components/layout/CardContainer.jsx"
import SeriesCard from "../../components/cards/SeriesCard.jsx"
import DateCard from "../../components/cards/DateCard.jsx"
import NavCard from "../../components/cards/NavCard.jsx"
import ArtistCard from "../../components/cards/ArtistCard.jsx"

import WidgetContainer from "../../components/layout/WidgetContainer.jsx"
import FixedCardWidget from "../../components/widgets/FixedCard.jsx"
import ResearchWidget from "../../components/widgets/canned/ResearchWidget.jsx"
import LineupWidget from "../../components/widgets/canned/LineupWidget.jsx"
import ActivityWidget from "../../components/widgets/canned/ActivityWidget.jsx"
import IntentToggle from "../../components/ui/canned/IntentToggle.jsx"

import SeriesWebsiteField from "./fields/series/SeriesWebsiteField.jsx"

import { remoteData } from "../../store/data"

const festivals = remoteData.Festivals

const jsx = () => {
	return {
		view: ({ attrs }) => (
			<div class="main-stage">
				{attrs.festivalId ? (
					<SeriesWebsiteField festivalId={attrs.festivalId} />
				) : (
					""
				)}
				{attrs.festivalId ? (
					<IntentToggle
						subjectObject={{
							subject: attrs.festivalId,
							subjectType: FESTIVAL
						}}
						permission={attrs.userRoles.includes("user")}
					/>
				) : (
					""
				)}

				<WidgetContainer>
					<LineupWidget festivalId={attrs.festivalId} />
					<ActivityWidget
						festivalId={attrs.festivalId}
						userId={attrs.userId}
						popModal={attrs.popModal}
					/>
					<ResearchWidget
						list={[]}
						userId={attrs.userId}
						popModal={attrs.popModal}
					/>
					<FixedCardWidget header="Related Events">
						{remoteData.Dates.getMany(festivals.getSubIds(attrs.festivalId))
							.sort((a, b) => a.basedate - b.basedate)
							.map(data => (
								<DateCard eventId={data.id} />
							))}
						<SeriesCard
							data={remoteData.Series.get(
								festivals.getSuperId(attrs.festivalId)
							)}
							eventId={festivals.getSuperId(attrs.festivalId)}
						/>
					</FixedCardWidget>
				</WidgetContainer>
			</div>
		)
	}
}
const FestivalDetail = {
	name: "FestivalDetail",
	preload: rParams => {
		//if a promise returned, instantiation of component held for completion
		//route may not be resolved; use rParams and not m.route.param
		const festivalId = parseInt(rParams.id, 10)
		//messages.forArtist(festivalId)
		///console.log('FestivalDetail preload', festivalId, rParams)
		return festivals
			.subjectDetails({ subject: festivalId, subjectType: FESTIVAL })
			.then(() => rParams.titleSet(festivals.getEventName(festivalId)))
			.then(m.redraw)
			.catch(err => console.error("FestivalDetail load incomplete"))
	},
	oncreate: ({ dom }) => {
		const height = dom.clientHeight
		//console.log('ArtistDetail DOM height', height)
		const scroller = dom.querySelector(".ft-widget-container")
		scroller.style["height"] = `${height - 270}px`
		scroller.style["flex-grow"] = 0
	},
	view: ({ attrs }) => {
		const festivalId = parseInt(m.route.param("id"), 10)

		const so = { subjectType: FESTIVAL, subject: festivalId }
		attrs.focusSubject(so)
		const decoded = attrs.auth.gtt()
		const accessible = decoded && !festivals.sellAccess(festivalId, decoded)
		const evtString = accessible ? "hasAccess" : "noAccess"
		attrs.eventSet(evtString)
		//console.log('FestivalDetail ciew evtString, decoded', evtString, decoded)
		//hasAccess if:
		//event not restricted OR
		//gtt token has access
		//console.log('FestivalDetail', attrs.gtt)

		const mapping = {
			userId: attrs.userId,
			userRoles: attrs.userRoles,
			popModal: attrs.popModal,
			festivalId: festivalId

			//sets: activeDateSets
		}
		return m(jsx, mapping)
	}
}
export default FestivalDetail
