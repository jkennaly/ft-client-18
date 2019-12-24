// src/components/detailViewsPregame/ArtistDetail.jsx


import m from 'mithril'
import _ from 'lodash'

import CardContainer from '../../components/layout/CardContainer.jsx';
import FestivalCard from '../../components/cards/FestivalCard.jsx';
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


const artist = (id) => artists.get(id)

const jsx = {
	view: ({attrs}) => <div class="main-stage">

			<WidgetContainer>
			
				<FixedCardWidget >
					<CloudImageField 
						userId={attrs.userId} 
						subjectType={2} 
						subject={attrs.artistId} 
						sources={['url']} 
						popModal={attrs.popModal}
						addDisabled={!attrs.userRoles.includes('admin')}
					/>
				</FixedCardWidget>
				{
					//if this artist playing an active date and the user has an implicit checkin to the date, show a link to the artists sets in gametime
					
					
				}
		
				{attrs.artist ? <FixedCardWidget header="Listen & Review" >
					<SpotifyCard fieldValue={attrs.artist.name} />
					<ReviewCard type="artist" data={attrs.artist} popModal={attrs.popModal} />
				</FixedCardWidget> : ''}
				{_.isArray(attrs.userRoles) && attrs.userRoles.includes('admin') ? <AdminWidget header="Artist Admin">
					<NavCard fieldValue="Fix Artist Names" action={() => m.route.set("/artists/pregame/fix/" + attrs.artistId)}/>
				</AdminWidget> : ''}
				<FixedCardWidget header="Festival Lineups">
					{
						remoteData.Lineups.festivalsForArtist(attrs.artistId)
							.sort((a, b) => b - a)
							.map(f => <FestivalCard eventId={f} artistId={attrs.artistId} />)
					}
				</FixedCardWidget>
				{
					//find each message about this attrs.artist and order by user
					_.map(messages.getFiltered({subjectType: ARTIST, subject: attrs.artistId, messageType: COMMENT}),
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
			const artistId = parseInt(rParams.id, 10)
			if (attrs.titleSet) attrs.titleSet(artist(artistId) ? artist(artistId).name : '')

		},
	oncreate: ({dom}) => {
		const height = dom.clientHeight
		//console.log('ArtistDetail DOM height', height)
		const scroller = dom.querySelector('.ft-widget-container')
		scroller.style['height'] = `${height - 270}px`
		scroller.style['flex-grow'] = 0

	},
		view: ({attrs}) => {
			const activeDateSets = remoteData.Sets.getFiltered({band: attrs.artistId})
				.filter(s => remoteData.Dates.active(remoteData.Days.getDateId(s.day)))
				

			const mapping = {
				userId: attrs.userId,
				userRoles: attrs.userRoles,
				popModal: attrs.popModal,
				artistId: parseInt(m.route.param('id'), 10),
				artist: artists.get(parseInt(m.route.param('id'), 10)),
				sets: activeDateSets
			}
			return m(jsx, mapping)
		}
}
export default ArtistDetail;
