// src/components/fields/CircleNail.jsx

import m from 'mithril'
import _ from 'lodash'
//import jQuery from 'jquery'
//import cloudinary from 'cloudinary'

import {remoteData} from '../../store/data.js'

const {Images: images} = remoteData



//const cl = typeof cloudy !== 'undefined' && cloudy.Cloudinary.new( { cloud_name: "dbezrymmc"})
const CircleNail = {
    view: ({attrs}) => {
        const mapping = {
            img: images.find(i => i.url && i.subjectType === attrs.subjectType && i.subject === attrs.subject)
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
                {attrs.img ? 
                    <img 
                        alt="artist image" 
                        src={images.src(attrs.img.id, {thumbnail: {width: 50, height: 50}})} 
                /> : ''}
            </div>
        }, mapping)
    }
        
}

export default CircleNail;