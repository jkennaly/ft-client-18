// src/components/cards/FestivalCard.jsx

import m from "mithril"

import MainEventField from "../fields/MainEventField.jsx"
import ComposedNameField from "../fields/ComposedNameField.jsx"
import NameField from "../fields/NameField.jsx"
import FestNail from "../fields/FestNail.jsx"

import { remoteData } from "../../store/data"

const FestivalCard = {
	view: ({ attrs }) => (
		<div
			class={"ft-card ft-card-festival " + (attrs.uiClass ? attrs.uiClass : "")}
			onclick={() => {
				m.route.set(
					attrs.route
						? attrs.route
						: "/fests/pregame/" +
								attrs.eventId +
								(attrs.eventId === "new" && attrs.eventId
									? "/" + attrs.eventId
									: "")
				)
			}}
		>
			<div class="ft-fields-with-thumbnail">
				{attrs.eventId ? <FestNail festivalId={attrs.eventId} /> : ""}
				{attrs.eventId !== "new" ? (
					<MainEventField
						seriesId={remoteData.Festivals.getSeriesId(attrs.eventId)}
						festivalId={attrs.eventId}
					/>
				) : (
					<ComposedNameField fieldValue={"New Festival Year"} />
				)}
			</div>
			{attrs.artistId ? (
				<div class="ft-set-diff-fields">
					{remoteData.ArtistPriorities.getName(
						remoteData.Lineups.getPriFromArtistFest(
							attrs.artistId,
							attrs.eventId
						)
					)}
				</div>
			) : (
				""
			)}
		</div>
	)
}

export default FestivalCard
