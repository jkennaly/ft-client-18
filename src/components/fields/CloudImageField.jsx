// src/components/fields/CloudImageField.jsx


import m from 'mithril'
import _ from 'lodash'
//import jQuery from 'jquery'
//import cloudinary from 'cloudinary'

import AttributionField from './AttributionField.jsx'
import NavButton from '../ui/NavButton.jsx'
import ImageModal from '../modals/ImageModal.jsx'


import { remoteData } from '../../store/data';
import { subjectData } from '../../store/subjectData'
import globals from '../../services/globals.js'

const { Images: images } = remoteData

var addingImage = false
const jsx = {
    //oninit: () => console.log('CloudImageField jsx init'),
    view: ({ attrs }) => <div class="ft-full-image">
        {attrs.image ? <img alt="artist image" src={images.src(attrs.image.id, { fill: { width: 288, height: 250 } })} /> : ''}
        {attrs.image ? <AttributionField imageId={attrs.image.id} popModal={attrs.popModal} hideFlag={attrs.hideFlag} /> : ''}
        {!attrs.addDisabled && !attrs.image && attrs.userRoles && attrs.userRoles.includes('admin') ? <NavButton fieldValue="Add image" action={e => addingImage = true} /> : ''}
        {!attrs.image && !attrs.addDisabled && attrs.subjectType === 2 && attrs.userRoles && attrs.userRoles.includes('admin') ? <a
            href={"https://www.google.com/search?q=" + encodeURIComponent(subjectData.name(attrs.subject, attrs.subjectType)) + "+site%3Acommons.wikimedia.org&hs=lbE&channel=fs&tbm=isch&source=lnt&tbs=sur:fc&sa=X"}
            target="_blank">
            <NavButton fieldValue="Image Search" />
        </a> : ''}

        <ImageModal
            display={addingImage}
            hide={() => addingImage = false}
            action={data => images.create(data)}
            subject={attrs.subject}
            subjectType={attrs.subjectType}
            sources={attrs.sources}
            phTitle={attrs.usePlaceholders ? subjectData.name({
                subject: attrs.subject,
                subjectType: attrs.subjectType
            }) : undefined}
            phCreator={attrs.usePlaceholders ? subjectData.name({
                subject: attrs.userId,
                subjectType: globals.USER
            }) : undefined}
            phSourceUrl={attrs.usePlaceholders ? String(window.location).replace(/(gametime)/, 'image') + '/' + attrs.userId : undefined}
            existingLicense={attrs.usePlaceholders}
            camera={attrs.usePlaceholders}
        />
    </div>
}
const CloudImageField = {
    name: 'CloudImageField',
    //oninit: () => console.log('CloudImageField init'),
    view: ({ attrs }) => {
        const specImageId = _.isInteger(attrs.imageId) ? attrs.imageId : _.toInteger(m.route.param('imageId'))
        const specImage = images.get(specImageId)
        const image = specImage ? specImage : images.find({ subjectType: attrs.subjectType, subject: attrs.subject })
        //console.log('CloudImageField specImage', specImageId, specImage)
        const mapping = {
            image: image,
            //imagePath: image ? image.url.substring(image.url.indexOf('artists/')) : '',
            usePlaceholders: Boolean(attrs.camera && attrs.userId),
            userId: attrs.userId,
            userRoles: attrs.userRoles,
            subject: attrs.subject,
            subjectType: attrs.subjectType,
            popModal: attrs.popModal,
            hideFlag: attrs.hideFlag,
            usePlaceholders: attrs.usePlaceHolders,
            addDisabled: attrs.addDisabled
        }
        //console.log(`ScheduleThemer mapping`, mapping)
        return m(jsx, mapping)
    }
}

export default CloudImageField;