// ArtistDetail.jsx


import m from 'mithril'
import _ from 'lodash'

import CardContainer from '../../components/layout/CardContainer.jsx';
import FestivalCard from '../../components/cards/FestivalCard.jsx';
import ArtistReviewCard from '../../components/cards/ArtistReviewCard.jsx';
import DateCard from '../../components/cards/DateCard.jsx';
import NavCard from '../../components/cards/NavCard.jsx';
import ReviewCard from '../../components/cards/ReviewCard.jsx';
import SpotifyCard from '../../components/cards/SpotifyCard.jsx';

import WidgetContainer from '../../components/layout/WidgetContainer.jsx';
import FixedCardWidget from '../../components/widgets/FixedCard.jsx';
import DiscussionWidget from '../../components/widgets/canned/DiscussionWidget.jsx';
import AdminWidget from '../../components/widgets/Admin.jsx';

import CloudImageField from '../../components/fields/CloudImageField.jsx';

import DiscussModal from '../modals/DiscussModal.jsx';

import {remoteData} from '../../store/data';

const artists = remoteData.Artists
const messages = remoteData.Messages

const id = () => parseInt(m.route.param('id'), 10)
const artist = _.memoize((id) => artists.get(id))

const ArtistDetail = (vnode) => { 
	var discussing = false
	var subjectObject = {}
	var messageArray = []
	return {
		preload: (rParams) => {
			//if a promise returned, instantiation of component held for completion
			//route may not be resolved; use rParams and not m.route.param
			const artistId = parseInt(rParams.id, 10)
			//messages.forArtist(artistId)
			//console.log('Research preload', seriesId, festivalId, rParams)
			if(artistId) return artists.subjectDetails({subject: artistId, subjectType: ARTIST})
		},
		oninit: ({attrs}) => {
			if (attrs.titleSet) attrs.titleSet(artist(id()) ? artist(id()).name : '')

		},
		view: ({attrs}) => <div class="main-stage">

			<WidgetContainer>
			
				<FixedCardWidget >
					<CloudImageField subjectType={2} subject={id()} sources={['url']} />
				</FixedCardWidget>
		
				{artist(id()) ? <FixedCardWidget header="Listen & Review" >
					<SpotifyCard fieldValue={artist(id()).name} />
					<ReviewCard type="artist" data={artist(id())} />
				</FixedCardWidget> : ''}
				{_.isArray(attrs.userRoles) && attrs.userRoles.includes('admin') ? <AdminWidget header="Artist Admin">
					<NavCard fieldValue="Fix Artist Names" action={() => m.route.set("/artists/pregame/fix/" + id())}/>
				</AdminWidget> : ''}
				<FixedCardWidget header="Festival Lineups">
					{
						remoteData.Lineups.festivalsForArtist(id())
							.sort((a, b) => b - a)
							.map(f => <FestivalCard eventId={f} artistId={id()} />)
					}
				</FixedCardWidget>
				{
					//find each message about this artist(id()) and order by user
					_.map(messages.forArtistReviewCard(id()),
						me => <DiscussionWidget 
							messageArray={me} 
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
			{messageArray.length && _.isInteger(attrs.userId) && attrs.userId ? <DiscussModal
				display={discussing} 
				hide={sub => {discussing = false;}}
				subject={subjectObject}
				messageArray={messageArray}
				reviewer={messageArray[0].fromuser}
				user={_.isInteger(attrs.userId) ? attrs.userId : 0}
			/> : ''}
		</div>
}}
export default ArtistDetail;
