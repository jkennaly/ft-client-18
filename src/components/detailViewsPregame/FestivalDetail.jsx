// FestivalDetail.jsx


import m from 'mithril'
import _ from 'lodash'

import LauncherBanner from '../ui/LauncherBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import SeriesCard from '../../components/cards/SeriesCard.jsx';
import DateCard from '../../components/cards/DateCard.jsx';
import NavCard from '../../components/cards/NavCard.jsx';
import ArtistCard from '../../components/cards/ArtistCard.jsx';

import WidgetContainer from '../../components/layout/WidgetContainer.jsx';
import FixedCardWidget from '../../components/widgets/FixedCard.jsx';
import ResearchWidget from '../../components/widgets/canned/ResearchWidget.jsx';

import {remoteData} from '../../store/data';


const upload = festival => e => {
    var file = e.target.files[0]
    
    var data = new FormData()
    data.append("myfile", file)

    remoteData.Lineups.upload(data, festival)
    	.then(() => m.redraw())
}
const FestivalDetail = (auth) => { return {
	oninit: () => {
		remoteData.Messages.loadList()
		remoteData.MessagesMonitors.loadList()
		remoteData.Images.loadList()
		remoteData.Series.loadList()
		remoteData.Festivals.loadList()
		remoteData.Dates.loadList()
		remoteData.Days.loadList()
		remoteData.Sets.loadList()
		remoteData.Venues.loadList()
		remoteData.Places.loadList()
		remoteData.Lineups.loadList()
      	remoteData.ArtistPriorities.loadList()
      	remoteData.StagePriorities.loadList()
      	remoteData.ArtistAliases.loadList()
		remoteData.Artists.loadList()
		remoteData.Users.loadList()
	},
	view: () => <div class="main-stage">
			<LauncherBanner 
				title={remoteData.Festivals.getEventName(parseInt(m.route.param('id'), 10))} 
			/>
		{!remoteData.Lineups.festHasLineup(parseInt(m.route.param('id'), 10)) ? 
			<div><label for="lineup-uploader">
        	{`Upload a file with the artist list (one name per line)`}
	        </label>
	        <input id="lineup-uploader" type="file" name="lineup-file" onchange={upload(parseInt(m.route.param('id'), 10))}/>
      	</div> : ''}
		{_.flow(
					m.route.param, parseInt,
					remoteData.Festivals.eventActive
					)('id') ? <DateCard festivalId={parseInt(m.route.param('id'), 10)}  eventId={'new'}/> : ''}
			<SeriesCard data={_.flow(
					m.route.param, parseInt,
					remoteData.Festivals.getSuperId,
					remoteData.Series.get
					)('id')
				} eventId={_.flow(
					m.route.param, parseInt,
					remoteData.Festivals.getSuperId
					)('id')
				}/>
				
			<WidgetContainer>
		<FixedCardWidget header="Festival Dates">
			{
				_.flow(
					m.route.param, parseInt,
					remoteData.Festivals.getSubIds,
					remoteData.Dates.getMany,
					)('id')
					.sort((a, b) => a.basedate - b.basedate)
					.map(data => <DateCard 
						eventId={data.id}
					/>)
			}
		</FixedCardWidget>		
		<FixedCardWidget header="Festival Lineup">
			{
				_.flow(
					m.route.param, parseInt,
					remoteData.Festivals.getLineupArtistIds,
					remoteData.Artists.getMany,
					)('id')
					.sort((a, b) => {
						const festivalId = _.flow(m.route.param, parseInt)('id')
						const aPriId = remoteData.Lineups.getPriFromArtistFest(a.id, festivalId)
						const bPriId = remoteData.Lineups.getPriFromArtistFest(b.id, festivalId)
						if(aPriId === bPriId) return a.name.localeCompare(b.name)
						const aPriLevel = remoteData.ArtistPriorities.getLevel(aPriId)
						const bPriLevel = remoteData.ArtistPriorities.getLevel(bPriId)
						return aPriLevel - bPriLevel
					})
					.map(data => <ArtistCard 
						data={data}
						festivalId={_.flow(m.route.param, parseInt)('id')}
					/>)
			}
		</FixedCardWidget>	
		<ResearchWidget list={[]} />
		</WidgetContainer>
	</div>
}}
export default FestivalDetail;
