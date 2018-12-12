// AverageRatingField.jsx
// attrs:
//	averageRating
//	pretext

import m from 'mithril'

import RatingStar from '../ui/RatingStar.jsx';

const MyRatingField = vnode => {
	var showRating = vnode.attrs.currentRating
	return {
		onupdate: vnode => {
			showRating = vnode.attrs.currentRating
		},
		view: ({ attrs }) =>
		<span class="ft-rating-field">{attrs.pretext}
			<RatingStar filled={showRating >= 0.95} action={e => {showRating = 1; if(attrs.action) attrs.action(showRating);}}/>
			<RatingStar filled={showRating >= 1.95} action={e => {showRating = 2; if(attrs.action) attrs.action(showRating);}}/>
			<RatingStar filled={showRating >= 2.95} action={e => {showRating = 3; if(attrs.action) attrs.action(showRating);}}/>
			<RatingStar filled={showRating >= 3.95} action={e => {showRating = 4; if(attrs.action) attrs.action(showRating);}}/>
			<RatingStar filled={showRating >= 4.95} action={e => {showRating = 5; if(attrs.action) attrs.action(showRating);}}/>
		</span>
	    //<!-- Results in a set of 15 stars, 10.5 of them selected -->
}};

export default MyRatingField;
