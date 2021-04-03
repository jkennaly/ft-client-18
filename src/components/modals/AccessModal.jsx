// src/components/modals/AccessModal.jsx

import m from "mithril"
import _ from "lodash"
import bucksLedger from "../../services/bites/user/account/profile/bucksLedger"
import bucksForm from "../../services/bites/user/account/profile/bucksForm"
import bucksSpend from "../../services/bites/user/account/profile/bucksSpend"
import Tract from "../tracts/Tract.jsx"
import InlineTable from "../fields/InlineTable"
import UIButton from "../ui/UIButton.jsx"
import IconText from "../fields/IconText.jsx"

import { remoteData } from "../../store/data"

const {
	Users: users,
	Days: days,
	Dates: dates,
	Festivals: festivals,
	Sets: sets
} = remoteData

const tractStates = {
	BucksHistory: false
}

const extraction = (() => {
	var hidden = []
	return elNumber => extracted => {
		if (_.isUndefined(extracted))
			return hidden.reduce((total, cv) => total || cv, false)
		hidden[elNumber] = Boolean(extracted)
	}
})()

// change selections

const classes = attrs => "ft-modal " + (attrs.display ? "" : "hidden")
var textValue = ""
var bucks = 0
const seriesId = so => {
	if (so.subjectType === FESTIVAL) return festivals.getSeriesId(so.subject)
	if (so.subjectType === DATE) return dates.getSeriesId(so.subject)
	if (so.subjectType === DAY) return days.getSeriesId(so.subject)
	if (so.subjectType === SET) return sets.getSeriesId(so.subject)
}
const festivalId = so => {
	//console.log('AccessModal festivalId days', days, days.getFestivalId)
	if (so.subjectType === FESTIVAL) return so.subject
	if (so.subjectType === DATE) return dates.getFestivalId(so.subject)
	if (so.subjectType === DAY) return days.getFestivalId(so.subject)
	if (so.subjectType === SET) return sets.getFestivalId(so.subject)
}
const dateId = so => {
	if (so.subjectType === FESTIVAL) {
		const dateIds = festivals.getSubDateIds(so.subject)
		if (dateIds.length === 1) return dateIds[0]
		return
	}
	if (so.subjectType === DATE) return so.subject
	if (so.subjectType === DAY) return days.getDateId(so.subject)
	if (so.subjectType === SET) return sets.getDateId(so.subject)
}
const dayId = so => {
	if (so.subjectType === FESTIVAL) {
		const dateIds = festivals.getSubDayIds(so.subject)
		if (dateIds.length === 1) return dateIds[0]
		return
	}
	if (so.subjectType === DATE) {
		const dayIds = dates.getSubDayIds(so.subject)
		if (dayIds.length === 1) return dayIds[0]
		return
	}
	if (so.subjectType === DAY) return so.subject
	if (so.subjectType === SET) return sets.getDayId(so.subject)
}
const jsx = {
	view: ({ attrs }) => (
		<div class={classes(attrs)}>
			<div class="ft-modal-content">
				{console.log("AccessModal", attrs.eventObject)}
				<header
					class={`ft-modal-info-plate ${
						extraction()() ? "c44-dn" : ""
					}`}
				>
					<p>
						Current FestiBucks: <IconText name="festibucks" />
						{attrs.bucks}
					</p>
					<p>
						Date Access: <IconText name="festibucks" />3
					</p>
				</header>
				{m(
					InlineTable,
					_.assign(
						{},
						bucksSpend(
							users,
							days,
							dates,
							festivals,
							attrs.eventObject(1)
						)
					)
				)}
				{m(
					InlineTable,
					_.assign({}, bucksForm(users, attrs.eventObject(0)))
				)}
				<UIButton
					action={e => {
						attrs.hide()
						if (attrs.cancelAction) attrs.cancelAction(textValue)
					}}
					buttonName={attrs.cancelText ? attrs.cancelText : "Cancel"}
				/>
			</div>
		</div>
	)
}

const AccessModal = {
	view: ({ attrs }) => {
		users.bucks({ total: true }).then(b => (bucks = b))
		const so = {
			subject: attrs.subject,
			subjectType: attrs.subjectType
		}

		const eventObject = i => {
			return {
				seriesId: seriesId(so),
				festivalId: festivalId(so),
				dateId: dateId(so),
				dayId: dayId(so),
				extraction: extraction(i),
				closeModal: attrs.hide,
				auth: attrs.auth,
				bucksUpdate: attrs.bucksUpdate
			}
		}
		const mapping = {
			display: attrs.display,
			hide: attrs.hide,
			cancelAction: attrs.cancelAction,
			cancelText: attrs.cancelText,
			bucks: bucks,
			eventObject: eventObject
		}
		return m(jsx, mapping)
	}
}

export default AccessModal
