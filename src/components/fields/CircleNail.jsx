// CircleNail.jsx

import m from 'mithril'
import _ from 'lodash'
import jQuery from 'jquery'
//import cloudinary from 'cloudinary'

import {remoteData} from '../../store/data.js'

var pathCache = {}
const CircleNail = vnode => {
    const cl = cloudy.Cloudinary.new( { cloud_name: "dbezrymmc"})
    var images = []
    var addingImage = false
    var userId = 0
    var sub = '' + vnode.attrs.subject + '-' + vnode.attrs.subjectType + '-' + remoteData.Images.list.length
    var imagePath = ''

    return {
        view: vnode => <div class="ft-card-thumbnail">
            {remoteData.Images.forSubject(vnode.attrs.subjectType, vnode.attrs.subject)
                .filter(i => i.url).length ? 
                    m.trust(cl.imageTag(remoteData.Images.forSubject(vnode.attrs.subjectType, vnode.attrs.subject)
                        .filter(i => i.url)[0]
                        .url.substring(remoteData.Images.forSubject(vnode.attrs.subjectType, vnode.attrs.subject)
                        .filter(i => i.url)[0].url.indexOf('artists/')), {
                            alt: "artist image", 
                            width: 50, 
                            height: 50,
                            crop: "thumb", 
                            radius: 'max'}).toHtml()) : 
            ''}
      </div>
}}

export default CircleNail;