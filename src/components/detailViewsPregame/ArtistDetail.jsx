// src/components/detailViewsPregame/ArtistDetail.jsx

import m from "mithril"
import _ from "lodash"
import { reviewSorter, festivalIdsByEndTimeSort } from "../../services/sorts"

import CardContainer from "../../components/layout/CardContainer.jsx"
import FestivalCard from "../../components/cards/FestivalCard.jsx"
import DateCard from "../../components/cards/DateCard.jsx"
import NavCard from "../../components/cards/NavCard.jsx"
import ReviewCard from "../../components/cards/ReviewCard.jsx"
import SpotifyCard from "../../components/cards/SpotifyCard.jsx"

import WidgetContainer from "../../components/layout/WidgetContainer.jsx"
import FixedCardWidget from "../../components/widgets/FixedCard.jsx"
import WikiWidget from "../../components/widgets/canned/WikiWidget.jsx"
import DiscussionWidget from "../../components/widgets/canned/DiscussionWidget.jsx"
import AdminWidget from "../../components/widgets/Admin.jsx"
import UIButton from "../../components/ui/UIButton.jsx"

import CloudImageField from "../../components/fields/CloudImageField.jsx"
import globals from "../../services/globals"
import { remoteData } from "../../store/data"

const {
	Artists: artists,
	Messages: messages,
	MessagesMonitors: messagesMonitors,
	Interactions: interactions,
	Festivals: festivals,
	Users: users
} = remoteData

const artist = id => artists.get(id)
const comments = id =>
	messages
		.getFiltered({
			subjectType: globals.ARTIST,
			subject: id,
			messageType: globals.COMMENT
		})
		.filter(m => users.get(m.fromuser))

const messageSorter = reviewSorter(interactions)

const jsx = () => {
	let count = 5
	return {
		view: ({ attrs }) => (
			<div class="main-stage">
				<WidgetContainer>
					<FixedCardWidget>
						<CloudImageField
							userId={attrs.userId}
							userRoles={attrs.userRoles}
							subjectType={2}
							subject={attrs.artistId}
							sources={["url"]}
							popModal={attrs.popModal}
							addDisabled={attrs.userRoles && !attrs.userRoles.includes("admin")}
						/>
					</FixedCardWidget>
					{
						//if this artist playing an active date and the user has an implicit checkin to the date, show a link to the artists sets in gametime
					}
					{attrs.wiki.length && attrs.wiki[0].length ? (
						<WikiWidget text={attrs.wiki[0]} link={attrs.wiki[1]} />
					) : (
						""
					)}
					{attrs.artist ? (
						<FixedCardWidget header="Listen & Review">
							<SpotifyCard fieldValue={attrs.artist.name} />
							<ReviewCard
								type="artist"
								data={attrs.artist}
								popModal={attrs.popModal}
							/>
						</FixedCardWidget>
					) : (
						""
					)}
					{_.isArray(attrs.userRoles) && attrs.userRoles.includes("admin") ? (
						<AdminWidget header="Artist Admin">
							<NavCard
								fieldValue="Fix Artist Names"
								action={() =>
									m.route.set("/artists/pregame/fix/" + attrs.artistId)
								}
							/>
						</AdminWidget>
					) : (
						""
					)}
					<FixedCardWidget header="Festival Lineups">
						{remoteData.Lineups.festivalsForArtist(attrs.artistId)
							.sort(festivalIdsByEndTimeSort(festivals))
							.map(f => (
								<FestivalCard eventId={f} artistId={attrs.artistId} />
							))}
					</FixedCardWidget>
					{//find each message about this attrs.artist and order by user
						_.map(
							_.take(
								messageSorter(attrs.userId)(comments(attrs.artistId)),
								count
							),
							me => (
								<DiscussionWidget
									messageArray={[me]}
									userId={attrs.userId}
									popModal={attrs.popModal}
									discussSubject={(so, me) =>
										attrs.popModal("discuss", {
											messageArray: me,
											subjectObject: so,
											reviewer: me[0].fromuser
										})
									}
								/>
							)
						)}
					{comments(attrs.artistId).length > count ? (
						<UIButton
							action={e => {
								//attrs.hide()
								e.stopPropagation()
								//console.log('pre rating ' + rating)
								count += 3
								m.redraw()
							}}
							buttonName="Show More"
						/>
					) : (
						""
					)}
				</WidgetContainer>
			</div>
		)
	}
}

const ArtistDetail = {
	preload: rParams => {
		//if a promise returned, instantiation of component held for completion
		//route may not be resolved; use rParams and not m.route.param
		const artistId = parseInt(rParams.id, 10)

		//messages.forArtist(artistId)
		//console.log("Artist Detail preload", artistId)
		return Promise.all([
			artists
				.subjectDetails({ subject: artistId, subjectType: globals.ARTIST })
				.then(() => {
					const artist = artists.get(artistId)
					if (artist) rParams.titleSet(artist.name)
					//console.log("ArtistDetail preload complete", artist.name)
					return
				}),
			messagesMonitors.remoteCheck(true),
			artists.getWikiPromise(artistId)
		])
			.then(m.redraw)
			.catch(console.error)
	},
	oncreate: ({ dom }) => {
		const height = dom.clientHeight
		//console.log('ArtistDetail DOM height', height)
		const scroller = dom.querySelector(".ft-widget-container")
		scroller.style["height"] = `${height - 270}px`
		scroller.style["flex-grow"] = 0
	},
	view: ({ attrs }) => {
		const artistId = parseInt(m.route.param("id"), 10)
		const artist = artists.get(artistId)
		if (artist) attrs.titleSet(artist.name)
		/*
			const activeDateSets = remoteData.Sets.getFiltered({band: attrs.artistId})
				.filter(s => remoteData.Dates.active(remoteData.Days.getDateId(s.day)))
				*/
		//console.log('ArtistDetail view', parseInt(m.route.param('id'), 10), artists.get(parseInt(m.route.param('id'), 10)))
		const mapping = {
			userId: attrs.userId,
			userRoles: attrs.userRoles,
			popModal: attrs.popModal,
			artistId: artistId,
			artist: artist,
			wiki: artists.getWiki(artistId)
			//sets: activeDateSets
		}
		return m(jsx, mapping)
	}
}
export default ArtistDetail
