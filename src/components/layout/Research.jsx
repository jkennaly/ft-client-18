// src/components/layout/Research.jsx
// Services

import m from "mithril"
import _ from "lodash"
import localforage from "localforage"
localforage.config({
	name: "FestiGram",
	storeName: "FestiGram"
})
import moment from "dayjs"

import FestivalCard from "../../components/cards/FestivalCard.jsx"
import WidgetContainer from "../../components/layout/WidgetContainer.jsx"
import ActivityCard from "../../components/cards/ActivityCard.jsx"
import BuyButtons from "../../components/tracts/buy/BuyButtons.jsx"
import ResearchWidget from "../../components/widgets/canned/ResearchWidget.jsx"
import ActivityWidget from "../../components/widgets/canned/ActivityWidget.jsx"
import ArtistSearchWidget from "../../components/widgets/canned/ArtistSearchWidget.jsx"
import EventSelector from "../detailViewsPregame/fields/event/EventSelector.jsx"

import { remoteData } from "../../store/data"
import { subjectData } from "../../store/subjectData"
import { seriesChange, festivalChange } from "../../store/action/event"

const series = remoteData.Series
const festivals = remoteData.Festivals

var lastAccess = {}
const jsx = {
	view: ({ attrs }) => (
		<div class="main-stage">
			<EventSelector
				seriesId={attrs.seriesId}
				festivalId={attrs.festivalId}
				festivalChange={festivalChange(attrs.seriesId)}
				seriesChange={seriesChange}
			/>
			<FestivalCard
				seriesId={attrs.seriesId}
				festivalId={attrs.festivalId}
				eventId={attrs.festivalId}
			/>
			{//hide buy buttons if
				//user has event access to any subeventattrs.focusSubject(so)

				attrs.access ? (
					""
				) : (
					<BuyButtons
						eventObject={{
							seriesId: attrs.seriesId,
							festivalId: attrs.festivalId
						}}
					/>
				)}
			<WidgetContainer>
				<ResearchWidget
					festivalId={attrs.festivalId}
					userId={attrs.userId}
					popModal={attrs.popModal}
				/>
				<ActivityWidget
					festivalId={attrs.festivalId}
					userId={attrs.userId}
					popModal={attrs.popModal}
					artistIds={remoteData.Festivals.reviewedArtistIds(
						attrs.festivalId,
						attrs.userId
					)}
				/>
				<ArtistSearchWidget
					festivalId={attrs.festivalId}
					overlay={"research"}
					popModal={attrs.popModal}
				/>
			</WidgetContainer>
		</div>
	)
}
const Research = {
	name: "Research",
	preload: rParams => {
		//if a promise returned, instantiation of component held for completion
		//route may not be resolved; use rParams and not m.route.param
		const seriesId = parseInt(rParams.seriesId, 10)
		const festivalId = parseInt(rParams.festivalId, 10)
		//console.log("Research preload", seriesId, festivalId, rParams)
		const id = festivalId ? festivalId : seriesId
		const type = festivalId ? FESTIVAL : SERIES
		const so = { subjectType: type, subject: id }
		return (festivalId
			? festivals.subjectDetails(so)
			: seriesId && !festivalId
				? series.subjectDetails(so)
				: Promise.resolve(true)
		).catch(console.error)
	},
	oninit: ({ attrs }) => {
		//console.log('Research init', attrs.seriesId, attrs.festivalId)
		if (attrs.titleSet) attrs.titleSet(`Research`)
		attrs.eventSet("")
		const seriesId = parseInt(m.route.param("seriesId"), 10)
		const festivalId = parseInt(m.route.param("festivalId"), 10)
		const endMoment = festivals.getEndMoment(festivalId)
		const id = festivalId ? festivalId : seriesId
		const type = festivalId ? FESTIVAL : SERIES
		const so = { subjectType: type, subject: id }
		const key = JSON.stringify(so)
		return (
			type === FESTIVAL &&
			attrs.auth.getGttDecoded()
				//.then(baseAccess => console.log('baseAccess', baseAccess) || baseAccess)
				.then(decoded => !festivals.sellAccess(festivalId, decoded))
				//.then(accessible => accessible ? 'hasAccess' : 'noAccess')
				.then(access => {
					_.set(lastAccess, key, access)
				})
				.catch(console.error)
		)
	},
	view: ({ attrs }) => {
		const seriesId = parseInt(m.route.param("seriesId"), 10)
		const festivalId = parseInt(m.route.param("festivalId"), 10)
		const endMoment = festivals.getEndMoment(festivalId)
		const id = festivalId ? festivalId : seriesId
		const type = festivalId ? FESTIVAL : SERIES
		const so = { subjectType: type, subject: id }
		const key = JSON.stringify(so)
		const access = _.get(lastAccess, key, false)
		//console.log('Research view', access)
		const mapping = {
			userId: attrs.userId,
			userRoles: attrs.userRoles,
			popModal: attrs.popModal,
			festivalId: festivalId,
			seriesId: seriesId,
			access: access

			//sets: activeDateSets
		}
		return m(jsx, mapping)
	}
}
export default Research
