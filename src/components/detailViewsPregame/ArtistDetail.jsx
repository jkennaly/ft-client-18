// ArtistDetail.jsx


import m from 'mithril'
const _ = require("lodash");

import LauncherBanner from '../ui/LauncherBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import FestivalCard from '../../components/cards/FestivalCard.jsx';
import ArtistReviewCard from '../../components/cards/ArtistReviewCard.jsx';
import DateCard from '../../components/cards/DateCard.jsx';
import NavCard from '../../components/cards/NavCard.jsx';
import ReviewCard from '../../components/cards/ReviewCard.jsx';
import SpotifyCard from '../../components/cards/SpotifyCard.jsx';

import WidgetContainer from '../../components/layout/WidgetContainer.jsx';
import FixedCardWidget from '../../components/widgets/FixedCard.jsx';
import AdminWidget from '../../components/widgets/Admin.jsx';

import CloudImageField from '../../components/fields/CloudImageField.jsx';

import {remoteData} from '../../store/data';

const ArtistDetail = (vnode) => { 
	var artistId = 0
	var artist = undefined
	var messages = []
	return {
		oninit: () => {
			remoteData.Images.loadList()
			remoteData.Artists.loadList()
			remoteData.Messages.loadList()
			remoteData.Lineups.loadList()
			remoteData.Festivals.loadList()
			remoteData.Series.loadList()
			remoteData.Sets.loadList()
			artistId = parseInt(m.route.param('id'), 10)
			artist = artistId ? remoteData.Artists.get(artistId) : undefined
			messages = remoteData.Messages.forArtist(artistId)
		},
		onupdate: () => {
			artist = artistId ? remoteData.Artists.get(artistId) : undefined
			messages = remoteData.Messages.forArtist(artistId)
			//console.log('ArtistDetail update')
		},
		view: () => <div class="main-stage">
			<LauncherBanner 
				title={artist ? artist.name : ''} 
			
			/>
			
			<WidgetContainer>
				<FixedCardWidget >
					<CloudImageField subjectType={2} subject={artistId} />
				</FixedCardWidget>
				{artist ? <FixedCardWidget header="Listen & Review" >
									<SpotifyCard fieldValue={artist.name} />
									<ReviewCard type="artist" data={artist} />
								</FixedCardWidget> : ''}
				<AdminWidget header="Artist Admin">
					<NavCard fieldValue="Fix Artist Names" action={() => m.route.set("/artists/pregame/fix/" + artistId)}/>
				</AdminWidget>
				<FixedCardWidget header="Festival Lineups">
					{
						remoteData.Lineups.festivalsForArtist(artistId)
							.map(f => <FestivalCard eventId={f} artistId={artistId} />)
					}
				</FixedCardWidget>
			</WidgetContainer>
				{
					//find each message about this artist and order by user
					_.map(remoteData.Messages.forArtistReviewCard(artistId),
						me => <ArtistReviewCard messageArray={me} />)
				}
		</div>
}}
export default ArtistDetail;
