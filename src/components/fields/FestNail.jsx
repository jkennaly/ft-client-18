// src/components/fields/FestNail.jsx

import m from 'mithril'
import _ from 'lodash'

import CircleNail from './CircleNail.jsx'

import {remoteData} from '../../store/data.js'

const images = remoteData.Images
const lineups = remoteData.Lineups


const FestNail = {
        view: ({attrs}) => <CircleNail 
        subjectType={ARTIST} 
        subject={

            //need artist id from festival lineup that has an image
            _.get(images.find(i => i.subjectType === ARTIST && lineups.find(l => l.band === i.subject && l.festival === attrs.festivalId)), 'subject', 0)
        }
      />
}

export default FestNail;