// src/components/fields/AttributionField.jsx

import m from 'mithril'
import QuarterButton from './buttons/QuarterButton.jsx'

import {remoteData} from '../../store/data'

const AttributionField = vnode => {
	var attrAr = []
	//[title, sourceUrl, author, license, licenseUrl]
	return {
		oninit: ({ attrs }) => attrAr = remoteData.Images.getAttributionAr(attrs.imageId),
		view: ({ attrs }) => <span class="c44-image-attribution">
			<a href={attrAr[1]} target="blank">{attrAr[0]} by {attrAr[2]}</a>
			 //  
			<a href={attrAr[4]} target="blank">{attrAr[3]}</a>
			{ attrs.hideFlag ? '' : <QuarterButton clickFunction={e => {
				//console.log('flag click imageId', attrs.imageId)
				attrs.popModal('flag', {
					image: remoteData.Images.get(attrs.imageId),
					subject: attrs.imageId,
					subjectType: IMAGE
				})
			}} ><i class="fas fa-flag" /></QuarterButton> }
		</span>
}};

export default AttributionField;