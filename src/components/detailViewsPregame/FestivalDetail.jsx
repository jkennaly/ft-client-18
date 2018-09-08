// FestivalDetail.jsx


const m = require("mithril");
const _ = require("lodash");

import DetailBanner from '../ui/DetailBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import SeriesCard from '../../components/cards/SeriesCard.jsx';
import DateCard from '../../components/cards/DateCard.jsx';
import NavCard from '../../components/cards/NavCard.jsx';
import ArtistCard from '../../components/cards/ArtistCard.jsx';

import {remoteData} from '../../store/data';
import {getAppContext} from '../../store/ui';

const upload = festival => e => {
    var file = e.target.files[0]
    
    var data = new FormData()
    data.append("myfile", file)

    remoteData.Lineups.upload(data, festival)
    	.then(() => m.redraw())
}
const FestivalDetail = (auth) => { return {
	oninit: () => {
		remoteData.Festivals.loadList()
		remoteData.Series.loadList()
		remoteData.Dates.loadList()
		remoteData.Lineups.loadList()
		remoteData.Artists.loadList()
		remoteData.ArtistPriorities.loadList()
	},
	view: () => <div class="main-stage">
		<DetailBanner 
			action={() => auth.logout()}
			title={remoteData.Festivals.getEventName(parseInt(m.route.param('id'), 10))} 
		/>
		{getAppContext() === 'pregame' && !remoteData.Lineups.festHasLineup(parseInt(m.route.param('id'), 10)) ? 
		<div><label for="lineup-uploader">
        {`Upload a file with the artist list (one name per line)`}
      </label>
      <input id="lineup-uploader" type="file" name="lineup-file" onchange={upload(parseInt(m.route.param('id'), 10))}/></div> : ''}
		{getAppContext() === 'pregame' ? <DateCard festivalId={parseInt(m.route.param('id'), 10)}  eventId={'new'}/> : ''}
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
		<CardContainer>
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
		</CardContainer>
		<CardContainer>
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
		</CardContainer>
	</div>
}}
export default FestivalDetail;
