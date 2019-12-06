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


import {remoteData} from '../../store/data';

const artists = remoteData.Artists
const messages = remoteData.Messages
const messagesMonitors = remoteData.MessagesMonitors

const id = () => parseInt(m.route.param('id'), 10)
const artist = (id) => artists.get(id)

const ArtistDetail = {
		preload: (rParams) => {
			//if a promise returned, instantiation of component held for completion
			//route may not be resolved; use rParams and not m.route.param
			const artistId = parseInt(rParams.id, 10)
			messagesMonitors.remoteCheck(true)
			//messages.forArtist(artistId)
			//console.log('Research preload', seriesId, festivalId, rParams)
			if(artistId) return artists.subjectDetails({subject: artistId, subjectType: ARTIST})
		},
		oninit: ({attrs}) => {
			//console.log('ArtistDetail init')
			if (attrs.titleSet) attrs.titleSet(artist(id()) ? artist(id()).name : '')

		},
	oncreate: ({dom}) => {
		const height = dom.clientHeight
		//console.log('ArtistDetail DOM height', height)
		const scroller = dom.querySelector('.ft-widget-container')
		scroller.style['height'] = `${height - 270}px`
		scroller.style['flex-grow'] = 0

	},
		view: ({attrs}) => <div class="main-stage">

			<WidgetContainer>
			
				<FixedCardWidget >
					<CloudImageField 
						userId={attrs.userId} 
						subjectType={2} 
						subject={id()} 
						sources={['url']} 
						popModal={attrs.popModal}
					/>
				</FixedCardWidget>
		
				{artist(id()) ? <FixedCardWidget header="Listen & Review" >
					<SpotifyCard fieldValue={artist(id()).name} />
					<ReviewCard type="artist" data={artist(id())} popModal={attrs.popModal} />
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
					_.map(messages.getFiltered({subjectType: ARTIST, subject: id(), messageType: COMMENT}),
						me => <DiscussionWidget 
							messageArray={[me]} 
							userId={attrs.userId}
							popModal={attrs.popModal} 
							discussSubject={(so, me) => attrs.popModal('discuss', {
								messageArray: me,
								subjectObject: so,
								reviewer: me[0].fromuser
							})}
						/>
					)
				}
			</WidgetContainer>
		</div>
}
export default ArtistDetail;
