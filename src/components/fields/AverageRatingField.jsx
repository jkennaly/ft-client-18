// AverageRatingField.jsx
// attrs:
//	averageRating
//	pretext

import m from 'mithril'

import RatingStar from '../ui/RatingStar.jsx';
//import './vendor/SimpleStarRating/SimpleStarRating.css'
/*

		<div class="ft-name-field ft-average-rating-field">
			<span>{attrs.pretext}: {attrs.averageRating}</span>
			<span class={(attrs.averageRating >= 0.95 ? 'fas' : 'far') + ' fa-star'} />
			<span class={(attrs.averageRating >= 1.95 ? 'fas' : 'far') + ' fa-star'} />
			<span class={(attrs.averageRating >= 2.95 ? 'fas' : 'far') + ' fa-star'} />
			<span class={(attrs.averageRating >= 3.95 ? 'fas' : 'far') + ' fa-star'} />
			<span class={(attrs.averageRating >= 4.95 ? 'fas' : 'far') + ' fa-star'} />
		</div >
		*/
const updateColor = ({dom, attrs}) => {if(attrs.ratingObject) dom.style.color = attrs.ratingObject.color}

const AverageRatingField = {
	oncreate: updateColor,
	onupdate: updateColor,
	view: ({ attrs }) =>
	<span>
		<RatingStar filled={(attrs.ratingObject ? attrs.ratingObject.rating : attrs.averageRating) >= 0.95} />
		<RatingStar filled={(attrs.ratingObject ? attrs.ratingObject.rating : attrs.averageRating) >= 1.95} />
		<RatingStar filled={(attrs.ratingObject ? attrs.ratingObject.rating : attrs.averageRating) >= 2.95} />
		<RatingStar filled={(attrs.ratingObject ? attrs.ratingObject.rating : attrs.averageRating) >= 3.95} />
		<RatingStar filled={(attrs.ratingObject ? attrs.ratingObject.rating : attrs.averageRating) >= 4.95} />
	</span>
    //<!-- Results in a set of 15 stars, 10.5 of them selected -->
};

export default AverageRatingField;
