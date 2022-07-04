// src/components/layout/Launcher.jsx
// Services

import m from "mithril"
import _ from "lodash"
import smartSearch from "smart-search"

import WidgetContainer from "../../components/layout/WidgetContainer.jsx"
import FixedCardWidget from "../../components/widgets/FixedCard.jsx"
import SearchCard from "../../components/cards/SearchCard.jsx"
import SeriesCard from "../../components/cards/SeriesCard.jsx"
import DateCard from "../../components/cards/DateCard.jsx"
import FestivalCard from "../../components/cards/FestivalCard.jsx"
import ArtistCard from "../../components/cards/ArtistCard.jsx"
import NavCard from "../../components/cards/NavCard.jsx"

import { remoteData } from "../../store/data"
import { artistSorter } from "../../services/sorts"

const artistData = ({
	dataField,
	fallback,
	festivalId,
	userId,
	search,
	recordCount,
	prefilter = x => x
}) => {
	const searchMatches = search
		? smartSearch(
			dataField.list.filter(prefilter),
			search.pattern,
			search.fields
		).map(x => x.entry)
		: dataField.list.sort(fallback)
	/*
	 Promise.all(_.take(searchMatches, 2 * recordCount).map(a => remoteData.Messages.loadForArtist.call(remoteData.Messages, a.id)))
		  .then(ar => {
				if(!_.take(ar, 5).reduce((pv, cv) => pv && cv, true)) {
					console.log('artistData redraw trigger')
					m.redraw()
				} 
				return ar
		  })
		  .catch(console.error)
		  */
	return _.take(searchMatches, recordCount)
}
//console.log('Launcher read')

let pattern
const patternChange = e => {
	pattern = e.target.value
	//console.log('ArtistSearchWidget pattern ' + pattern)
}

//console.log('Launcher running')
let discoveryArtists = []
const Launcher = {
	name: "Launcher",
	preload: params => {
		//console.log('Launcher init', params)
		if (params.titleSet) params.titleSet(`FestiGram Launcher`, m.route.get())
	},
	view: ({ attrs }) => {
		//console.log('Launcher attrs')
		return (
			<div class="main-stage">
				<WidgetContainer>
					<FixedCardWidget header="My Festivals">
						{remoteData.Dates.checkedIn(attrs.userId).map(data => (
							<DateCard eventId={data.id} />
						))}
						{attrs.userId
							? remoteData.Festivals.intended().map(data => (
								<FestivalCard eventId={data.id} />
							))
							: ""}
					</FixedCardWidget>
					<FixedCardWidget header="Current Festival Dates">
						{remoteData.Dates.current().map(data => (
							<DateCard eventId={data.id} />
						))}
					</FixedCardWidget>
					<FixedCardWidget header="Upcoming Festival Dates">
						{remoteData.Dates.soon().map(data => (
							<DateCard eventId={data.id} />
						))}
					</FixedCardWidget>
					<FixedCardWidget header="Upcoming Festivals">
						{remoteData.Festivals.future()
							.filter(f => remoteData.Lineups.find(l => l.festival === f.id))
							//.filter(x => console.log('Launcher Upcoming Festivals', x) || true)
							.map(data => (
								<FestivalCard
									eventId={data.id}
									uiClass="ft-festivals-upcoming"
								/>
							))}
					</FixedCardWidget>
					<FixedCardWidget header="Artists">
						<SearchCard patternChange={patternChange} />
						{//three from next event
							//one ft chosen
							//one from fav event (future if possible, past if not)
							//balance (up to 5 total) from highest uncommented priority
							artistData({
								dataField: remoteData.Artists,
								search: pattern
									? { pattern: [pattern], fields: { name: true } }
									: undefined,
								recordCount: 5,
								fallback: artistSorter(remoteData)(
									["future", "siteActivity", "peakPriority"],
									["siteActivity"]
								)
							}).map(data => (
								<ArtistCard data={data} />
							))}
					</FixedCardWidget>
				</WidgetContainer>
			</div>
		)
	}
}
export default Launcher
