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

import SeriesWebsiteField from './fields/series/SeriesWebsiteField.jsx'

import { remoteData } from "../../store/data";

const upload = (festival, initFunction) => e => {
	var file = e.target.files[0];

	var data = new FormData();
	data.append("myfile", file);

	remoteData.Lineups.upload(data, festival).then(initFunction);
};
const FestivalDetail = () => {
	var messageArray = [];
	var discussing = false;
	let festivalId = 0;
	const init = () => {
		//console.log('FestivalDetail init')
		festivalId = parseInt(m.route.param("id"), 10)
		remoteData.Messages.loadForFestival(festivalId)
			.catch(err => {
				console.log('FestivalDetail Message load error')
				console.log(err)
			})
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
				{festivalId ? <SeriesWebsiteField festivalId={festivalId} /> : ''}
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
						{(remoteData.Dates.getMany(
							remoteData.Festivals.getSubIds(
								parseInt(
									m.route.param("id"))))
						)
							.sort((a, b) => a.basedate - b.basedate)
							.map(data => (
								<DateCard eventId={data.id} />
							))}
						{(remoteData.Festivals.eventActive(
								parseInt(
									m.route.param("id")))
						) ? (
							<DateCard festivalId={festivalId} eventId={"new"} />
						) : (
							""
						)}
						<SeriesCard
							data={(remoteData.Series.get(
							remoteData.Festivals.getSuperId(
								parseInt(
									m.route.param("id"))))
						)}
							eventId={(
							remoteData.Festivals.getSuperId(
								parseInt(
									m.route.param("id"))))}
						/>
					</FixedCardWidget>
				</WidgetContainer>
			</div>
		)
	};
};
export default FestivalDetail;
