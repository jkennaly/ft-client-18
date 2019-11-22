// src/components/fields/CircleNail.jsx

import m from 'mithril'
import _ from 'lodash'
import jQuery from 'jquery'
//import cloudinary from 'cloudinary'

import {remoteData} from '../../store/data.js'

const img = attrs => remoteData.Images.find(i => i.url && i.subjectType === attrs.subjectType && i.subject === attrs.subject)

const cl = cloudy.Cloudinary.new( { cloud_name: "dbezrymmc"})
const CircleNail = {
        view: ({attrs}) => <div class="ft-card-thumbnail">
        {
            //console.log(`CircleNail init`, vnode.attrs.subjectType, vnode.attrs.subject)
        }
            {attrs.subject && img(attrs) ? 
                    m.trust(cl.imageTag(img(attrs)
                        .url.substring(img(attrs).url.indexOf('artists/')), {
                            alt: "artist image", 
                            width: 50, 
                            height: 50,
                            crop: "thumb", 
                            radius: 'max'}).toHtml()) : 
            ''}
      </div>
}

export default CircleNail;