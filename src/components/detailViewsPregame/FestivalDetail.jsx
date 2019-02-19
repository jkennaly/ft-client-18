// FestivalDetail.jsx

import m from "mithril";
import _ from "lodash";

import LauncherBanner from "../ui/LauncherBanner.jsx";
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

import { remoteData } from "../../store/data";

const upload = (festival, initFunction) => e => {
	var file = e.target.files[0];

	var data = new FormData();
	data.append("myfile", file);

	remoteData.Lineups.upload(data, festival).then(initFunction);
};
const FestivalDetail = auth => {
	var messageArray = [];
	var discussing = false;
	let festivalId = 0;
	const init = () => {
		//console.log('FestivalDetail init')
		festivalId = parseInt(m.route.param("id"), 10);
		/*
		Promise.all([
			remoteData.MessagesMonitors.loadList(),
			remoteData.Images.loadList(),
			remoteData.Series.loadList(),
			remoteData.Festivals.loadList(),
			remoteData.Dates.loadList(true),
			remoteData.Days.loadList(),
			remoteData.Sets.loadList(),
			remoteData.Venues.loadList(),
			remoteData.Places.loadList(),
			remoteData.Lineups.loadList(true),
	      	remoteData.ArtistPriorities.loadList(),
	      	remoteData.StagePriorities.loadList(),
	      	remoteData.ArtistAliases.loadList(true),
			remoteData.Artists.loadList(true),
			remoteData.Users.loadList(),
			remoteData.Intentions.loadList(),
		])
		//.then(() => console.log('load complete'))
		*/
		remoteData.Messages.loadForFestival(festivalId).then(() => m.redraw());
	};
	return {
		oninit: init,
		view: () => (
			<div class="main-stage">
				<LauncherBanner
					title={remoteData.Festivals.getEventName(festivalId)}
				/>
				{!remoteData.Lineups.festHasLineup(festivalId) ? (
					<div>
						<label for="lineup-uploader">
							{`Upload a file with the artist list (one name per line)`}
						</label>
						<input
							id="lineup-uploader"
							type="file"
							name="lineup-file"
							onchange={upload(festivalId, init)}
						/>
					</div>
				) : (
					""
				)}
				{festivalId ? (
					<IntentToggle
						subjectObject={{ subject: festivalId, subjectType: 7 }}
					/>
				) : (
					""
				)}

				<WidgetContainer>
					<LineupWidget festivalId={festivalId} />
					<ActivityWidget festivalId={festivalId} />
					<ResearchWidget list={[]} />
					<FixedCardWidget header="Related Events">
						{_.flow(
							m.route.param,
							parseInt,
							remoteData.Festivals.getSubIds,
							remoteData.Dates.getMany
						)("id")
							.sort((a, b) => a.basedate - b.basedate)
							.map(data => (
								<DateCard eventId={data.id} />
							))}
						{_.flow(
							m.route.param,
							parseInt,
							remoteData.Festivals.eventActive
						)("id") ? (
							<DateCard festivalId={festivalId} eventId={"new"} />
						) : (
							""
						)}
						<SeriesCard
							data={_.flow(
								m.route.param,
								parseInt,
								remoteData.Festivals.getSuperId,
								remoteData.Series.get
							)("id")}
							eventId={_.flow(
								m.route.param,
								parseInt,
								remoteData.Festivals.getSuperId
							)("id")}
						/>
					</FixedCardWidget>
				</WidgetContainer>
			</div>
		)
	};
};
export default FestivalDetail;
