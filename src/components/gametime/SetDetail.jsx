// src/components/gametime/SetDetail.jsx

//a full screen component that displays the days schedule

import m from 'mithril'
import _ from 'lodash'
import {subjectData} from '../../store/subjectData'
import {remoteData} from '../../store/data'

import ReviewCard from '../../components/cards/ReviewCard.jsx';
import ReviewArrayCard from '../../components/cards/ReviewArrayCard.jsx';
import UserCard from '../../components/cards/UserCard.jsx';

import CheckinToggle from '../ui/canned/CheckinToggle.jsx'
import WidgetContainer from '../../components/layout/WidgetContainer.jsx';
import FixedCardWidget from '../../components/widgets/FixedCard.jsx';
import ReviewArraysWidget from '../../components/widgets/canned/ReviewArraysWidget.jsx';

import NameField from '../../components/fields/NameField.jsx';
import CloudImageField from '../../components/fields/CloudImageField.jsx';

import DiscussModal from '../modals/DiscussModal.jsx';

const {Dates: dates, Sets: sets, Messages: messages} = remoteData
const jsx = {
	view: function ({attrs}) {return <div>
	
{
	//console.log('gt setDetail attrs', attrs)
}
	<WidgetContainer>
	<NameField fieldValue={attrs.name} />
		<FixedCardWidget >
			<CloudImageField 
				subjectType={attrs.subjectType} 
				subject={attrs.subject} 
				camera={true}
				sources={['local']}
				addDisabled={!attrs.checkedIn}
				userId={attrs.userId}
				usePlaceholders={true}
			/>
		</FixedCardWidget>
			<FixedCardWidget >
		{attrs.checkinAllowed ?
				<CheckinToggle 
					subjectObject={attrs.subjectObject} 
					debug={false}
					permission={attrs.checkinAllowed} 
					allowed={attrs.checkinAllowed}
				/>
		: ''}
				{attrs.checkedIn ? <ReviewCard 
					subjectObject={attrs.subjectObject} 
					name={subjectData.name(attrs.subjectObject)} 
					popModal={attrs.popModal}
				/> : ''}
			</FixedCardWidget>
		{attrs.checkins && attrs.checkins.active && attrs.checkins.active.length ? <ReviewArraysWidget 
			header={`Checked In`}
		>
			{
				_.uniqBy(attrs.checkins.active, 'fromuser')
					//.filter(r => console.log('SetDetail checkins.active map', r) || true)
					.map(checkin => <UserCard 
						data={{id: checkin.fromuser}}
					/>)
							
			}
		</ReviewArraysWidget> : ''}
		{attrs.checkins && attrs.checkins.ended && attrs.checkins.ended.length ? <ReviewArraysWidget 
			header={`Checked Out`}
		>
			{
				_.uniqBy(attrs.checkins.ended, 'fromuser')
					//.filter(r => console.log('SetDetail checkins.ended map', r) || true)
					.map(checkin => <UserCard 
						data={{id: checkin.fromuser}}
					/>)
					
					
			}
		</ReviewArraysWidget> : ''}
		{attrs.myReviews && attrs.myReviews.length ? <ReviewArraysWidget 
			header={`My Reviews`}
		>
			{
				attrs.myReviews
					//.filter(r => console.log('SetDetail myReviews map', r) || true)
					.map(review => <ReviewArrayCard 
						review={review} 
						shortDefault={true}
					/>)
					
					
			}
		</ReviewArraysWidget> : ''}
		{attrs.friendReviews && attrs.friendReviews.length ? <ReviewArraysWidget 
			header={`Followed Reviews`}
		>
			{
				attrs.friendReviews
					.filter(r => remoteData.Interactions.some(i => r.author === i.subject && i.subjectType === USER && i.type === FOLLOW))
					//.filter(r => console.log('SetDetail review.friendReviews map', r) || true)
					.map(review => <ReviewArrayCard 
						review={review} 
						shortDefault={true}
					/>)
					
					
			}
		</ReviewArraysWidget> : ''}
		{attrs.friendReviews && attrs.friendReviews.length ? <ReviewArraysWidget 
			header={`Other Reviews`}
		>
			{
				attrs.friendReviews
					.filter(r => !remoteData.Interactions.some(i => r.author === i.subject && i.subjectType === USER && i.type === FOLLOW))
					//.filter(r => console.log('SetDetail review.friendReviews map', r) || true)
					.map(review => <ReviewArrayCard 
						review={review} 
						shortDefault={true}
					/>)
					
					
			}
		</ReviewArraysWidget> : ''}
		
	</WidgetContainer>
	{
		//console.log('SetDetail view done')
}
</div>}
}
const SetDetail = { 
	name: 'SetDetail',
	view: ({attrs}) => {
		//console.log('SetDetail attrComp', attrs)
		const dayId = attrs.subjectObject.subjectType === 9 ? attrs.subjectObject.subject :
			attrs.subjectObject.subjectType === 3 ? sets.getDayId(attrs.subjectObject.subject) :
			0
		const dateId = attrs.subjectObject.subjectType === 8 ? attrs.subjectObject.subject :
			attrs.subjectObject.subjectType === 3 ? sets.getDateId(attrs.subjectObject.subject) :
			attrs.subjectObject.subjectType === 9 ? dates.getDateId(attrs.subjectObject.subject) :
			0
		const setId = attrs.subjectObject.subjectType === 3 ? attrs.subjectObject.subject : 0
		const userId = attrs.userId
		const subjectObject = {
			subject: attrs.subjectObject.subject,
			subjectType: attrs.subjectObject.subjectType
		}
		const subject = attrs.subjectObject.subject
		const subjectType = attrs.subjectObject.subjectType
		const set = sets.get(setId)
		const checkedIn = messages.implicit(subjectObject, userId)
		const checkinAllowed = sets.active(setId) && !checkedIn
		const eventCheckins = messages.getFiltered(_.assign({messageType: CHECKIN}, subjectObject))


		const checkins = eventCheckins.reduce((checkins, ec) => {
			const active = messages.implicit(ec, ec.fromuser)
			if(active) checkins.active.push(ec)
			else checkins.ended.push(ec)
			return checkins
		}, {
			active: [],
			ended: []
		})
		const name = sets.getName(setId)
		const reviews = subjectData.getReviews(subjectObject, userId)
		const myReviews = reviews.myReviews
		const friendReviews = reviews.friendReviews
		const mapping = {
			dayId: dayId,
			dateId: dateId,
			setId: setId,
			userId: userId,
			subjectObject: subjectObject,
			subject: subject,
			subjectType: subjectType,
			set: set,
			checkedIn: checkedIn,
			checkinAllowed: checkinAllowed,
			checkins: checkins,
			name: name,
			myReviews: myReviews,
			friendReviews: friendReviews,
			popModal: attrs.popModal
		}
		//console.log('SetDetail attrComp mapping', mapping)
	
		return m(jsx, mapping )
}}
export default SetDetail;