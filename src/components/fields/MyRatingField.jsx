// src/components/fields/AverageRatingField.jsx
// attrs:
//	averageRating
//	pretext

import m from 'mithril'
import _ from 'lodash'

import RatingStar from '../ui/RatingStar.jsx';

const MyRatingField = vnode => {
	var showRating = _.clone(vnode.attrs.currentRating)
	var lastFlag = _.clone(vnode.attrs.changeFlag)
	return {
		onbeforeupdate: vnode => {
			//console.log(' updating MyRatingField changeFlag ' + lastFlag + '=>' + vnode.attrs.changeFlag)
			//console.log('pre MyRatingField showRating ' + showRating)
			if(!vnode.attrs.changeFlag || vnode.attrs.changeFlag <= lastFlag) return
			lastFlag = _.clone(vnode.attrs.changeFlag)
			showRating = _.clone(vnode.attrs.currentRating)
			//console.log('MyRatingField showRating ' + showRating)
			//console.log('MyRatingField vnode.attrs.currentRating ' + vnode.attrs.currentRating)
		},
		view: ({ attrs }) =>
		<span class="ft-rating-field">{attrs.pretext}
			<RatingStar filled={showRating >= 0.95} action={e => {showRating = 1; if(attrs.action) attrs.action(showRating);}}/>
			<RatingStar filled={showRating >= 1.95} action={e => {showRating = 2; if(attrs.action) attrs.action(showRating);}}/>
			<RatingStar filled={showRating >= 2.95} action={e => {showRating = 3; if(attrs.action) attrs.action(showRating);}}/>
			<RatingStar filled={showRating >= 3.95} action={e => {showRating = 4; if(attrs.action) attrs.action(showRating);}}/>
			<RatingStar filled={showRating >= 4.95} action={e => {showRating = 5; if(attrs.action) attrs.action(showRating);}}/>
		</span>
}};

export default MyRatingField;
