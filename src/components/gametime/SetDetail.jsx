// SetDetail.jsx

//a full screen component that displays the days schedule

import m from 'mithril'
import _ from 'lodash'
import {subjectData} from '../../store/subjectData'

import LauncherBanner from '../ui/LauncherBanner.jsx';
import ArtistReviewCard from '../../components/cards/ArtistReviewCard.jsx';
import ReviewCard from '../../components/cards/ReviewCard.jsx';
import ReviewArrayCard from '../../components/cards/ReviewArrayCard.jsx';

import WidgetContainer from '../../components/layout/WidgetContainer.jsx';
import FixedCardWidget from '../../components/widgets/FixedCard.jsx';
import ReviewArraysWidget from '../../components/widgets/canned/ReviewArraysWidget.jsx';

import CloudImageField from '../../components/fields/CloudImageField.jsx';

import DiscussModal from '../modals/DiscussModal.jsx';

const SetDetail = () => { 
	var detail, displayRating, detailSubject, detailSubjectType
	var messageArray = []
	var subjectObject = {}
	var discussing = false
	return {
		oninit: ({attrs}) => {
			detail = subjectData.getDetail(attrs.subjectObject)
			detailSubject = attrs.subjectObject.subject
			detailSubjectType = attrs.subjectObject.subjectType
			//console.log('SetDetail onit', attrs.subjectObject, detail)
		
		},
		onbeforeupdate: ({attrs}) => {
			detail = subjectData.getDetail(attrs.subjectObject)
			detailSubject = attrs.subjectObject.subject
			detailSubjectType = attrs.subjectObject.subjectType
			//console.log('SetDetail onbeforeupdate', detailSubject)
		},
		view: ({attrs}) => <div>
		{
			//console.log('SetDetail view', detail)
			//subject name/time string/rating imposed over subject image
			//checkin toggle (if place or event) and review button (if not user)
			//my most recent comment on subject or subject focus
			//most recent other type of comment (subject/ subject focus, if there is a subject focus)
			//most recent comment by each friend (on subject or focus), right up to now


		}
			
		{detail.name}
			<WidgetContainer>
				<FixedCardWidget >
					<CloudImageField 
						subjectType={attrs.subjectObject.subjectType} 
						subject={attrs.subjectObject.subject} 
						camera={true}
						sources={['local']}
					/>
				</FixedCardWidget>
				{detail && detail.myReviews && detail.myReviews.length ? <ReviewArraysWidget 
					header={`My Reviews`}
				>
					{
						detail.myReviews
							//.filter(r => console.log('SetDetail myReviews map', r) || true)
							.map(review => <ReviewArrayCard 
								review={review} 
								shortDefault={true}
							/>)
							
							
					}
				</ReviewArraysWidget> : ''}
				{detail && detail.friendReviews && detail.friendReviews.length ? <ReviewArraysWidget 
					header={`Other Reviews`}
				>
					{
						detail.friendReviews
							//.filter(r => console.log('SetDetail review.friendReviews map', r) || true)
							.map(review => <ReviewArrayCard 
								review={review} 
								shortDefault={true}
							/>)
							
							
					}
				</ReviewArraysWidget> : ''}
				
			</WidgetContainer>
		</div>
}};
/*
				{detail && detail.myReviews && detail.myReviews.length ? <FixedCardWidget  >
				
					<ReviewCard type="detail" data={detail} />
				
				</FixedCardWidget> : ''}
				{
					//find each message about this artist and order by user
					_.map(remoteData.Messages.forArtistReviewCard(artistId),
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
			{messageArray.length && userId ? <DiscussModal
				display={discussing} 
				hide={sub => {discussing = false;}}
				subject={subjectObject}
				messageArray={messageArray}
				reviewer={messageArray[0].fromuser}
				user={userId}
			/> : ''}
const detailObject = {
	name: 'name',
	subStrings: ['timeString'],
	rating: 0,
	imgSrc: 'url',
	checkinAllowed: true,
	reviewAllowed: true,
	checkedIn: false,
	//reviewArray: [author, subject, rating, comment, timestamp]
	myReviews: [[0, {subject: 0, subjectType: 0}, 0, 'ok, not great']],
	friendReviews: [[0, {subject: 0, subjectType: 0}, 0, 'ok, not great']]

}
*/
export default SetDetail;