// ArtistDetail.jsx


import m from 'mithril'
import _ from 'lodash'

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

import DiscussModal from '../modals/DiscussModal.jsx';

import {remoteData} from '../../store/data';

// Services
import Auth from '../../services/auth.js';
const auth = new Auth();

const ArtistDetail = (vnode) => { 
	var artistId = 0
	var artist = undefined
	var messages = []
	var discussing = false
	var subjectObject = {}
	var messageArray = []
	var userId = 0
	return {
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
		remoteData.Organizers.loadList()
		remoteData.Places.loadList()
		remoteData.Lineups.loadList()
      	remoteData.ArtistPriorities.loadList()
      	remoteData.StagePriorities.loadList()
      	remoteData.StageLayouts.loadList()
		remoteData.PlaceTypes.loadList()
      	remoteData.ArtistAliases.loadList()
		remoteData.Artists.loadList()
		remoteData.ParentGenres.loadList()
		remoteData.Genres.loadList()
		remoteData.ArtistGenres.loadList()
		remoteData.Users.loadList()
			artistId = parseInt(m.route.param('id'), 10)
			artist = artistId ? remoteData.Artists.get(artistId) : undefined
			messages = remoteData.Messages.forArtist(artistId)
			auth.getFtUserId()
				.then(id => userId = id)
				.then(() => {})
				.then(m.redraw)
				.catch(err => m.route.set('/auth'))
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
				{
					//find each message about this artist and order by user
					_.map(remoteData.Messages.forArtistReviewCard(artistId),
						me => <ArtistReviewCard 
							messageArray={me} 
							reviewer={me[0].fromuser}
							overlay={'discuss'}
							discussSubject={(s, me) => {
								subjectObject = _.clone(s)
								messageArray = _.clone(me)
								//console.log('ArtistDetail ArtistReviewCard discussSubject me length ' + me.length)
								discussing = true
							}}
						/>
					)
				}
			</WidgetContainer>
			{messageArray.length ? <DiscussModal
							display={discussing} 
							hide={sub => {discussing = false;}}
							subject={subjectObject}
							messageArray={messageArray}
							reviewer={messageArray[0].fromuser}
							user={userId}
						/> : ''}
		</div>
}}
export default ArtistDetail;
