// services/bites/events/nextFestival.js

//get the FestivalCard for the next festival the user intends

import m from "mithril"
import _ from "lodash"
import { subjectCard } from "../../../../components/cards/subjectCard"
import { festivalIdsByEndTimeSort } from "../../../sorts.js"
import globals from "../../../globals"

const biteCache = {}
const biteTimes = {}

//get future dates
//check if user has an intention for any festivals

const festivalIntentions = (goerId, intentions, festivals) =>
	intentions
		.lbfilter({
			where: {
				and: [
					{ user: goerId },
					{ subjectType: globals.FESTIVAL },
					{ subject: { inq: festivals.future().map(x => x.id) } }
				]
			},
			fields: { subject: true }
		})
		.then(intendedFestivalIds =>
			intendedFestivalIds
				.map(x => x.subject)
				.sort(festivalIdsByEndTimeSort(festivals))
		)
		.then(
			intendedFestivalIds =>
				(intendedFestivalIds[0] &&
					festivals.getLocalPromise(intendedFestivalIds[0])) || [false, false]
		)
		.then(([fest, upd]) => fest)
		.then(fav => {
			_.set(biteTimes, `users.festivalIntentions[${goerId}]`, Date.now())
			_.set(biteCache, `users.festivalIntentions[${goerId}]`, fav)
			return fav
		})
const intendedFestival = (goerId, intentions, festivals) => {
	const cacheTime = _.get(biteTimes, `users.festivalIntentions[${goerId}]`, 0)
	const cacheOk = cacheTime + 60000 > Date.now()
	if (!cacheOk) festivalIntentions(goerId, intentions, festivals).catch(console.log)
	return _.get(biteCache, `users.festivalIntentions[${goerId}]`, 0)
}
export default (goerId, intentions, festivals) => {
	const baseValue = intendedFestival(goerId, intentions, festivals)
	//console.log("recentFavoriteBite", goerId, baseValue)
	const value = baseValue
		? subjectCard(
			{ subject: baseValue.id, subjectType: globals.FESTIVAL },
			{
				userId: goerId,
				uiClass: "",
				eventId: baseValue.id
			}
		)
		: ""

	const title = "Next Festival"
	return {
		value: value,
		title: title,
		public: true,
		name: title
	}
}
