// src/components/fields/CircleNail.jsx

import m from 'mithril'
import _ from 'lodash'
import jQuery from 'jquery'
//import cloudinary from 'cloudinary'

import {remoteData} from '../../store/data.js'



const cl = typeof cloudy !== 'undefined' && cloudy.Cloudinary.new( { cloud_name: "dbezrymmc"})
const CircleNail = {
    view: ({attrs}) => {
        const mapping = {
            img: remoteData.Images.find(i => i.url && i.subjectType === attrs.subjectType && i.subject === attrs.subject)
        }
        return m({
            view: ({attrs}) => <div 
                class="ft-card-thumbnail" 
                onclick={e => {
                    //console.log('CircleNail click', `/pregame/subjects/${attrs.img.subjectType}/${attrs.img.subject}`, attrs.img )
                    if(!attrs.img) return
                    e.preventDefault();
                    e.stopPropagation();
                    m.route.set(`/pregame/subject/${attrs.img.subjectType}/${attrs.img.subject}`, {imageId: attrs.img.id});
                }} 
                >
                {
                    //console.log(`CircleNail init`, vnode.attrs.subjectType, vnode.attrs.subject)
                }
                {attrs.img && cl ? 
                    m.trust(cl.imageTag(attrs.img
                        .url.substring(attrs.img.url.indexOf('artists/')), {
                            alt: "artist image", 
                            width: 50, 
                            height: 50,
                            crop: "thumb", 
                            radius: 'max'}).toHtml()) : 
                ''}
            </div>
        }, mapping)
    }
        
}

export default CircleNail;