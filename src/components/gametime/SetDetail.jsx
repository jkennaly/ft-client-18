// SetDetail.jsx

//a full screen component that displays the days schedule

import m from 'mithril'
import _ from 'lodash'
import {subjectData} from '../../store/subjectData'

import ArtistReviewCard from '../../components/cards/ArtistReviewCard.jsx';
import ReviewCard from '../../components/cards/ReviewCard.jsx';
import ReviewArrayCard from '../../components/cards/ReviewArrayCard.jsx';
import UserCard from '../../components/cards/UserCard.jsx';

import CheckinToggle from '../ui/canned/CheckinToggle.jsx'
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
			console.log('SetDetail init', attrs.subjectObject)
			detail = subjectData.getDetail(attrs.subjectObject)
			detailSubject = attrs.subjectObject.subject
			detailSubjectType = attrs.subjectObject.subjectType
			console.log('SetDetail onit', attrs.subjectObject, detail)
		
		},
		onbeforeupdate: ({attrs}) => {
			detail = subjectData.getDetail(attrs.subjectObject)
			detailSubject = attrs.subjectObject.subject
			detailSubjectType = attrs.subjectObject.subjectType
			//console.log('SetDetail onbeforeupdate', detailSubject)
		},
		view: ({attrs}) => <div>
			
		{detail.name}
			<WidgetContainer>
				<FixedCardWidget >
					<CloudImageField 
						subjectType={attrs.subjectObject.subjectType} 
						subject={attrs.subjectObject.subject} 
						camera={true}
						sources={['local']}
						addDisabled={!detail.checkedIn}
					/>
				</FixedCardWidget>
				{detail.checkinAllowed ?
					<FixedCardWidget >
						<CheckinToggle subjectObject={attrs.subjectObject} debug={false} />
						{detail.checkedIn ? <ReviewCard subjectObject={attrs.subjectObject} name={subjectData.name(attrs.subjectObject)} /> : ''}
					</FixedCardWidget>
				: ''}
				{detail && detail.checkins && detail.checkins.active && detail.checkins.active.length ? <ReviewArraysWidget 
					header={`Checked In`}
				>
					{
						_.uniqBy(detail.checkins.active, 'fromuser')
							//.filter(r => console.log('SetDetail checkins.active map', r) || true)
							.map(checkin => <UserCard 
								data={{id: checkin.fromuser}}
							/>)
							
							
					}
				</ReviewArraysWidget> : ''}
				{detail && detail.checkins && detail.checkins.ended && detail.checkins.ended.length ? <ReviewArraysWidget 
					header={`Checked Out`}
				>
					{
						_.uniqBy(detail.checkins.ended, 'fromuser')
							//.filter(r => console.log('SetDetail checkins.ended map', r) || true)
							.map(checkin => <UserCard 
								data={{id: checkin.fromuser}}
							/>)
							
							
					}
				</ReviewArraysWidget> : ''}
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
			{console.log('SetDetail view done')}
		</div>
}};
export default SetDetail;